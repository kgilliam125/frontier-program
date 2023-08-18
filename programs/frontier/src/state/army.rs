use crate::errors::ArmyError;
use anchor_lang::prelude::*;

#[account]
pub struct Army {
    player_account: Pubkey,
    army_size: u32,
    army_max_size: u32,
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
}
