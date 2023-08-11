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
        // todo set to 0 after ix available to add resources
        self.resources = Resources { wood: 1, stone: 1, iron: 0, steel: 0, mana: 0, gold: 0 };
        self.is_initialized = true;

        Ok(())
    }

    pub fn subtract_resources(&mut self, requested_resources: Resources) -> Result<()> {
        require_gte!(self.resources.wood, requested_resources.wood, PlayerError::NotEnoughResources);
        require_gte!(self.resources.stone, requested_resources.stone, PlayerError::NotEnoughResources);
        require_gte!(self.resources.iron, requested_resources.iron, PlayerError::NotEnoughResources);
        require_gte!(self.resources.steel, requested_resources.steel, PlayerError::NotEnoughResources);
        require_gte!(self.resources.mana, requested_resources.mana, PlayerError::NotEnoughResources);
        require_gte!(self.resources.gold, requested_resources.gold, PlayerError::NotEnoughResources);

        // Don't need checked_sub since using guards above to return more readable error
        self.resources.wood -= requested_resources.wood;
        self.resources.stone -= requested_resources.stone;
        self.resources.iron -= requested_resources.iron;
        self.resources.steel -= requested_resources.steel;
        self.resources.mana -= requested_resources.mana;
        self.resources.gold -= requested_resources.gold;

        Ok(())
    }

    pub fn add_resources(&mut self, requested_resources: Resources) -> Result<()> {
        self.resources.wood = self.resources.wood.checked_add(requested_resources.wood).unwrap();
        self.resources.stone = self.resources.stone.checked_add(requested_resources.stone).unwrap();
        self.resources.iron = self.resources.iron.checked_add(requested_resources.iron).unwrap();
        self.resources.steel = self.resources.steel.checked_add(requested_resources.steel).unwrap();
        self.resources.mana = self.resources.mana.checked_add(requested_resources.mana).unwrap();
        self.resources.gold = self.resources.gold.checked_add(requested_resources.gold).unwrap();

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Resources {
    pub wood: u32,
    pub stone: u32,
    pub iron: u32,
    pub steel: u32,
    pub mana: u32,
    pub gold: u32,
}
