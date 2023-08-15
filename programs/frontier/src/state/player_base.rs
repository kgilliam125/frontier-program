use crate::errors::BaseError;
use anchor_lang::prelude::*;

#[account]
pub struct PlayerBase {
    player_account: Pubkey,
    pub structure_count: u32,
    pub base_size: u32,
    max_base_size: u32,
    pub rating: u32,
    is_initialized: bool
}

impl PlayerBase {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;
    pub const MAX_RATING: u32 = 2;
    // pub const MAX_POSITION: Position = Position { x: 100, y: 100 };
    // pub const MIN_POSITION: Position = Position { x: -100, y: -100 };

    // making up some values for now
    pub fn get_max_base_size(&self) -> u32 {
        match self.rating {
            0 => 3,
            1 => 5,
            2 => 7,
            _ => 100 // Should error instead
        }
    }

    pub fn init(&mut self, player_account: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, BaseError::AlreadyInitialized);

        self.player_account = player_account;
        self.structure_count = 0;
        self.base_size = 0;
        self.rating = 0;
        self.max_base_size = self.get_max_base_size();
        self.is_initialized = true;

        Ok(())
    }

    pub fn upgrade(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, BaseError::NotInitialized);
        require!(self.rating < PlayerBase::MAX_RATING, BaseError::MaxRatingExceeded);

        self.rating += 1;
        self.max_base_size = self.get_max_base_size();

        Ok(())
    }

    pub fn add_structure_to_base(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, BaseError::NotInitialized);
        require!(self.base_size <= self.get_max_base_size(), BaseError::BaseSizeExceeded);

        self.structure_count = self.structure_count.checked_add(1).unwrap();
        self.base_size += 1;

        Ok(())
    }

    pub fn remove_structure_from_base(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, BaseError::NotInitialized);
        require!(self.structure_count > 0, BaseError::NoStructures);

        // note structure count cannot be decremented. It is used to track
        // Structure accounts and acts as a key for pagination
        self.base_size -= 1;

        Ok(())
    }
}
