use crate::errors::BaseError;
use anchor_lang::prelude::*;

#[account]
pub struct PlayerBase {
    player_account: Pubkey,
    structure_count: u32,
    base_size: u32,
    rating: u32,
    is_initialized: bool
}

impl PlayerBase {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self, player_account: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, BaseError::AlreadyInitialized);

        self.player_account = player_account;
        self.structure_count = 0;
        self.base_size = 0;
        self.rating = 0;
        self.is_initialized = true;

        Ok(())
    }
}
