use crate::errors::GameError;
use anchor_lang::prelude::*;

#[account]
pub struct Army {
    is_initialized: bool
}

impl Army {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, false, GameError::PlayerAlreadyInitialized);

        Ok(())
    }
}
