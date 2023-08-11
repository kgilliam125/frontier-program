use crate::errors::PlayerError;
use anchor_lang::prelude::*;

#[account]
pub struct Player {
    owner_pubkey: Pubkey,
    rank: u8,
    experience: u32,
    resources: Resources,
    is_initialized: bool
}

impl Player {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self, owner_pubkey: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, PlayerError::AlreadyInitialized);

        self.owner_pubkey = owner_pubkey;
        self.rank = 0;
        self.experience = 0;
        self.resources = Resources { wood: 0, stone: 0, iron: 0, steel: 0, mana: 0, gold: 0 };
        self.is_initialized = true;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Resources {
    wood: u32,
    stone: u32,
    iron: u32,
    steel: u32,
    mana: u32,
    gold: u32,
}
