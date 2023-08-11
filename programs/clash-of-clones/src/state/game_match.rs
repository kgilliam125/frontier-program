use crate::errors::GameMatchError;
use anchor_lang::prelude::*;

#[account]
pub struct GameMatch {
    attacking_army: Pubkey,
    defending_base: Pubkey,
    is_initialized: bool
}

impl GameMatch {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self, pubkey: Pubkey, base_pubkey: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, GameMatchError::AlreadyInitialized);

        Ok(())
    }
}
