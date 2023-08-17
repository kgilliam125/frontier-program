use crate::errors::BaseError;
use crate::state::{StructureStats, StructureType};
use anchor_lang::prelude::*;

#[account]
pub struct PlayerBase {
    player_account: Pubkey,
    pub structure_count: u32,
    pub base_size: u32,
    max_base_size: u32,
    max_workers: u32,
    pub rating: u16,
    is_initialized: bool
}

impl PlayerBase {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;
    pub const MAX_RATING: u16 = 50;

    // Is there a restriction on structures in a base?
    pub fn get_max_base_size(&self) -> u32 {
        match self.rating {
            0 => 3,
            1 => 5,
            2 => 7,
            _ => 100 // Should error instead
        }
    }

    // Note: The base ratings mirrors the rank of the ThroneHall
    pub fn get_max_workers(&self) -> u32 {
        match self.rating {
            0 => 0, // must build throne hall to get workers
            1 => 5,
            2 => 7,
            3 => 10,
            4 ..= 5 => 15,
            _ => 20 // Max level is 50, but treat anything about as the same
        }
    }

    pub fn init(&mut self, player_account: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, BaseError::AlreadyInitialized);

        self.player_account = player_account;
        self.structure_count = 0;
        self.base_size = 0;
        self.rating = 0;

        let worker_count = self.get_max_workers();

        self.max_base_size = self.get_max_base_size();
        self.max_workers = worker_count;
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

    pub fn add_structure_to_base(&mut self, structure_type: StructureType, structure_stats: StructureStats) -> Result<()> {
        require_eq!(self.is_initialized, true, BaseError::NotInitialized);

        match structure_type {
            StructureType::ThroneHall => {
                self.rating = structure_stats.rank;
                
                let worker_count = self.get_max_workers();
                self.max_base_size = self.get_max_base_size(); 
                self.max_workers = worker_count;
            }
            _ => {}
        }
        
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
