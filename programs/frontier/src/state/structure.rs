use crate::errors::StructureError;
use crate::state::Resources;
use anchor_lang::prelude::*;

#[account]
pub struct Structure {
    pub id: u32,
    pub player_base: Pubkey,
    pub player: Pubkey,
    pub structure_type: StructureType, // todo check if enum extension breaks pre-existing accounts
    pub stats: StructureStats,
    pub position: Position,
    pub is_destroyed: bool,
    pub is_initialized: bool,
}

impl Structure {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;
    pub const MAX_RATING: u32 = 3;

    pub fn get_base_stats(structure_type: StructureType) -> StructureStats {
        match structure_type {
            StructureType::ArcherTower => StructureStats {
                rank: 1,
                health: 100,
                attack: 10,
                defense: 0,
                speed: 0,
                range: 0,
                assigned_workers: 0,
                collection_interval: 0,
                last_interaction_time: 0,
            },
            StructureType::MageTower => StructureStats {
                rank: 1,
                health: 50,
                attack: 20,
                defense: 0,
                speed: 0,
                range: 0,
                assigned_workers: 0,
                collection_interval: 0,
                last_interaction_time: 0,
            },
            StructureType::SentryCreature => StructureStats {
                rank: 1,
                health: 150,
                attack: 20,
                defense: 0,
                speed: 0,
                range: 0,
                assigned_workers: 0,
                collection_interval: 0,
                last_interaction_time: 0,
            },
            StructureType::Wall => StructureStats {
                rank: 1,
                health: 500,
                attack: 0,
                defense: 0,
                speed: 0,
                range: 0,
                assigned_workers: 0,
                collection_interval: 0,
                last_interaction_time: 0,
            },
            StructureType::ThroneHall => StructureStats {
                rank: 1,
                health: 200,
                attack: 0,
                defense: 0,
                speed: 0,
                range: 0,
                assigned_workers: 5,
                collection_interval: 0,
                last_interaction_time: 0,
            },
            StructureType::Barracks
            | StructureType::Blacksmith
            | StructureType::ManaWell
            | StructureType::CarpenterHut
            | StructureType::PvpPortal => StructureStats {
                rank: 1,
                health: 100,
                attack: 0,
                defense: 0,
                speed: 0,
                range: 0,
                assigned_workers: 0,
                collection_interval: 0,
                last_interaction_time: 0,
            },
            StructureType::Mine | StructureType::Quarry | StructureType::LumberMill => {
                StructureStats {
                    rank: 1,
                    health: 100,
                    attack: 0,
                    defense: 0,
                    speed: 0,
                    range: 0,
                    assigned_workers: 0,
                    collection_interval: 60,
                    last_interaction_time: 0,
                }
            }
        }
    }

    pub fn init(
        &mut self,
        player_pubkey: Pubkey,
        base_pubkey: Pubkey,
        id: u32,
        structure_stats: StructureStats,
        structure_type: StructureType,
        position: Position,
    ) -> Result<()> {
        require_eq!(
            self.is_initialized,
            false,
            StructureError::AlreadyInitialized
        );

        self.id = id;
        self.player = player_pubkey;
        self.player_base = base_pubkey;
        self.is_initialized = true;
        self.structure_type = structure_type;
        self.stats = structure_stats;
        self.position = position;
        self.is_destroyed = false;

        Ok(())
    }

    pub fn move_structure(&mut self, new_pos: Position) -> Result<()> {
        self.position = new_pos;

        Ok(())
    }

    // May need more logic here, using Result type
    pub fn add_worker(&mut self) -> Result<()> {
        require!(self.is_assignable(), StructureError::CannotAssignWorker);

        self.stats.assigned_workers += 1;

        Ok(())
    }

    pub fn remove_worker(&mut self) -> Result<()> {
        require!(self.is_assignable(), StructureError::CannotAssignWorker);
        require_gt!(
            self.stats.assigned_workers,
            0,
            StructureError::StructureHasNoWorkers
        );

        self.stats.assigned_workers -= 1;

        Ok(())
    }

    fn is_assignable(&self) -> bool {
        match self.structure_type {
            StructureType::LumberMill
            | StructureType::Mine
            | StructureType::Quarry
            | StructureType::ThroneHall => true,
            _ => false,
        }
    }

    pub fn try_collect_resources(&mut self) -> Result<Resources> {
        if self.stats.assigned_workers <= 0 {
            return Ok(Resources {
                wood: 0,
                stone: 0,
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            });
        }

        let clock = Clock::get()?;
        let seconds_since_last_interaction =
            clock.unix_timestamp - self.stats.last_interaction_time;

        msg!(
            "Seconds since last interaction: {}",
            seconds_since_last_interaction
        );
        msg!("Collection interval: {}", self.stats.collection_interval);
        msg!("Last interaction: {}", self.stats.last_interaction_time);

        if seconds_since_last_interaction < self.stats.collection_interval as i64 {
            return Ok(Resources {
                wood: 0,
                stone: 0,
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            });
        }

        self.stats.last_interaction_time = clock.unix_timestamp;

        Ok(self.collect_resources())
    }

    fn calculate_resource_distribution(&mut self, value: u32) -> u32 {
        let rank_multiplier = value
            .checked_mul(self.stats.rank as u32)
            .unwrap_or(u32::MAX);

        rank_multiplier
            .checked_mul(self.stats.assigned_workers as u32)
            .unwrap_or(u32::MAX)
    }

    fn collect_resources(&mut self) -> Resources {
        match self.structure_type {
            StructureType::Quarry => Resources {
                wood: 0,
                stone: self.calculate_resource_distribution(250),
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            },
            StructureType::LumberMill => Resources {
                wood: self.calculate_resource_distribution(250),
                stone: 0,
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            },
            StructureType::Mine => Resources {
                wood: 0,
                stone: 0,
                iron: self.calculate_resource_distribution(250),
                steel: self.calculate_resource_distribution(250),
                mana: 0,
                gold: self.calculate_resource_distribution(250),
            },
            _ => Resources {
                wood: 0,
                stone: 0,
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            },
        }
    }

    pub fn try_take_damage(&mut self, attacking_power: u16) -> Result<()> {
        require!(self.is_initialized, StructureError::NotInitialized);
        // todo need to add checks for which units can attack which structures. now its an ffa

        let damage = attacking_power;
        let defense = self.stats.defense;

        let damage_taken = if damage > defense {
            damage - defense
        } else {
            0
        };

        self.stats.health = self.stats.health.saturating_sub(damage_taken);

        if self.stats.health == 0 {
            self.is_destroyed = true;
        }

        Ok(())
    }

    pub fn can_attack(&self) -> bool {
        if self.is_destroyed {
            return false;
        }

        match self.structure_type {
            StructureType::ArcherTower
            | StructureType::MageTower
            | StructureType::Wall
            | StructureType::SentryCreature => true,
            _ => false,
        }
    }
}

// Using the same stats for all structures, so not all
// will be used. Likely want to separate into instructions
// per structure class at some point
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub struct StructureStats {
    pub rank: u16,
    pub health: u16,
    pub attack: u16,
    pub defense: u16,
    pub speed: u16,
    pub range: u16,
    pub assigned_workers: u8,
    pub collection_interval: u16,   // seconds
    pub last_interaction_time: i64, // UnixTimestamp as i64 or IDL will fail
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub struct Position {
    pub x: u16,
    pub y: u16,
}

// NOTE: enum order cannot be changed, only extended
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq)]
pub enum StructureType {
    // --- Utility ---
    ThroneHall,
    Barracks,
    Blacksmith,   // after beta
    ManaWell,     // after beta
    CarpenterHut, // after beta
    PvpPortal,
    // --- Resource ---
    Mine,
    Quarry,
    LumberMill,
    // --- Defensive ---
    ArcherTower,
    MageTower,
    Wall,
    SentryCreature,
}
