use crate::errors::ArmyError;
use anchor_lang::prelude::*;

#[account]
pub struct Army {
    player_account: Pubkey,
    pub army_size: u32,
    pub army_max_size: u32,
    rating: u32,
    is_initialized: bool
}

impl Army {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self, player_account: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, ArmyError::AlreadyInitialized);

        self.player_account = player_account;
        self.army_size = 0;
        self.army_max_size = 10;
        self.rating = 0;
        self.is_initialized = true;

        Ok(())
    }

    // To be used later for upgraded armies
    fn get_max_army_size(&self) -> u32 {
        self.army_max_size
    }

    // Trying a new pattern here vs. in player_base where the count is capped and used for the unit index
    pub fn add_unit_to_army(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, ArmyError::NotInitialized);
        require!(self.army_size <= self.get_max_army_size(), ArmyError::SizeExceeded);

        self.army_size += 1;

        Ok(())
    }

    pub fn remove_unit_from_army(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, ArmyError::NotInitialized);
        require!(self.army_size > 0, ArmyError::ArmyEmpty);

        self.army_size -= 1;

        Ok(())
    }
}
