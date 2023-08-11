use crate::errors::GameError;
use anchor_lang::prelude::*;

#[account]
pub struct Structure {
    is_initialized: bool
}

impl Structure {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self, pubkey: Pubkey, base_pubkey: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, GameError::PlayerAlreadyInitialized);

        Ok(())
    }
}
