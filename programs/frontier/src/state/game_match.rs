use crate::errors::GameMatchError;
use crate::state::{Resources, StructureType};
use anchor_lang::prelude::*;

#[account]
pub struct GameMatch {
    id: u32,
    pub state: MatchState,
    pub active_units: u32,
    pub active_structures: u32,
    pub throne_hall_active: bool,
    pub victor: Victor,
    pub match_reward: Resources,
    attacking_army: Pubkey,
    defending_base: Pubkey,
    is_initialized: bool,
}

impl GameMatch {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    fn calculate_reward_distribution(&self, throne_hall_rank: u16) -> u32 {
        let base_reward: u32 = 100;
        base_reward
            .checked_mul(throne_hall_rank as u32)
            .unwrap_or(u32::MAX)
    }

    pub fn init(
        &mut self,
        match_id: u32,
        attacking_army: Pubkey,
        defending_base: Pubkey,
    ) -> Result<()> {
        require_eq!(
            self.is_initialized,
            false,
            GameMatchError::AlreadyInitialized
        );

        self.id = match_id;
        self.state = MatchState::Populating;
        self.attacking_army = attacking_army;
        self.defending_base = defending_base;
        self.active_units = 0;
        self.active_structures = 0;
        self.victor = Victor::None;
        self.match_reward = Resources {
            wood: 0,
            stone: 0,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        };
        self.is_initialized = true;
        Ok(())
    }

    pub fn can_add(&self) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);
        require!(
            self.state == MatchState::Populating,
            GameMatchError::MatchAlreadyStarted
        );

        Ok(())
    }

    pub fn can_attack(&self) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);
        require!(
            self.state == MatchState::InProgress,
            GameMatchError::MatchNotInProgress
        );
        require!(self.active_units > 0, GameMatchError::NoActiveUnits);
        require!(
            self.active_structures > 0,
            GameMatchError::NoActiveStructures
        );
        require!(
            self.throne_hall_active == true,
            GameMatchError::NoActiveThroneHall
        );

        Ok(())
    }

    pub fn add_unit(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);
        require!(
            self.state == MatchState::Populating,
            GameMatchError::MatchAlreadyStarted
        );

        self.active_units += 1;

        Ok(())
    }

    pub fn add_structure(
        &mut self,
        structure_type: StructureType,
        structure_rank: u16,
    ) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);
        require!(
            self.state == MatchState::Populating,
            GameMatchError::MatchAlreadyStarted
        );

        if structure_type == StructureType::ThroneHall {
            require_eq!(
                self.throne_hall_active,
                false,
                GameMatchError::ThroneHallAlreadyActive
            );
            self.throne_hall_active = true;
            self.match_reward = Resources {
                wood: 0,
                stone: 0,
                iron: 0,
                steel: 0,
                mana: 0,
                gold: self.calculate_reward_distribution(structure_rank),
            }
        }

        self.active_structures += 1;

        Ok(())
    }

    pub fn destroy_unit(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);
        require!(
            self.state == MatchState::InProgress,
            GameMatchError::MatchNotInProgress
        );
        require!(self.active_units > 0, GameMatchError::NoActiveUnits);

        self.active_units -= 1;
        if self.active_units == 0 {
            self.state = MatchState::Completed;
            self.victor = Victor::Defender;
        }

        Ok(())
    }

    pub fn destroy_structure(&mut self, structure_type: StructureType) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);
        require!(
            self.state == MatchState::InProgress,
            GameMatchError::MatchNotInProgress
        );
        require!(
            self.active_structures > 0,
            GameMatchError::NoActiveStructures
        );

        self.active_structures -= 1;
        if self.active_structures == 0 || structure_type == StructureType::ThroneHall {
            self.state = MatchState::AwaitingRewardDistribution;
            self.victor = Victor::Attacker;
        }

        Ok(())
    }

    pub fn can_distribute_rewards(&self) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);
        require!(
            self.state == MatchState::AwaitingRewardDistribution,
            GameMatchError::MatchNotReadyForRewardDistribution
        );

        Ok(())
    }

    pub fn try_transition_state(&mut self, requested_state: MatchState) -> Result<()> {
        require_eq!(self.is_initialized, true, GameMatchError::NotInitialized);

        /*
           Match transitions:
           Populating -> InProgress, Cancelled
           InProgress -> Cancelled, Completed
        */
        match requested_state {
            MatchState::InProgress => {
                require!(
                    self.state == MatchState::Populating,
                    GameMatchError::MatchAlreadyStarted
                );
            }
            MatchState::Cancelled => {
                // Technically means you can cancel a match that's already been cancelled but w/e
                require!(
                    self.state != MatchState::Completed
                        || self.state != MatchState::AwaitingRewardDistribution,
                    GameMatchError::MatchAlreadyEnded
                );
            }
            MatchState::AwaitingRewardDistribution => {
                require!(
                    self.state == MatchState::InProgress,
                    GameMatchError::MatchNotInProgress
                );
                require!(
                    !self.throne_hall_active || self.active_structures == 0,
                    GameMatchError::MatchNotReadyForRewardDistribution
                )
            }
            MatchState::Completed => {
                require!(
                    self.state == MatchState::InProgress
                        || self.state == MatchState::AwaitingRewardDistribution,
                    GameMatchError::MatchNotInProgress
                );
            }
            MatchState::Populating => {
                require!(false, GameMatchError::CannotRepopulateMatch);
            }
        }

        self.state = requested_state;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq)]
pub enum MatchState {
    Populating,
    InProgress,
    Cancelled,
    AwaitingRewardDistribution,
    Completed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq)]
pub enum Victor {
    None,
    Attacker,
    Defender,
}
