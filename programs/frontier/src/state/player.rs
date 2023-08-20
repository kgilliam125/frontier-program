use crate::errors::PlayerError;
use crate::state::Resources;
use crate::state::FactionType;
use anchor_lang::prelude::*;

#[account]
pub struct Player {
    owner_pubkey: Pubkey,
    rank: u8,
    experience: u32,
    resources: Resources,
    faction: FactionType,
    is_initialized: bool,
}

impl Player {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self, owner_pubkey: Pubkey, faction_type: FactionType) -> Result<()> {
        require_eq!(self.is_initialized, false, PlayerError::AlreadyInitialized);

        self.owner_pubkey = owner_pubkey;
        self.rank = 0;
        self.experience = 0;
        // todo: Set resources in some more obvious place
        self.resources = Resources {
            wood: 500,
            stone: 500,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        };
        self.faction = faction_type;
        self.is_initialized = true;

        Ok(())
    }

    pub fn subtract_resources(&mut self, requested_resources: Resources) -> Result<()> {
        require_gte!(
            self.resources.wood,
            requested_resources.wood,
            PlayerError::NotEnoughResources
        );
        require_gte!(
            self.resources.stone,
            requested_resources.stone,
            PlayerError::NotEnoughResources
        );
        require_gte!(
            self.resources.iron,
            requested_resources.iron,
            PlayerError::NotEnoughResources
        );
        require_gte!(
            self.resources.steel,
            requested_resources.steel,
            PlayerError::NotEnoughResources
        );
        require_gte!(
            self.resources.mana,
            requested_resources.mana,
            PlayerError::NotEnoughResources
        );
        require_gte!(
            self.resources.gold,
            requested_resources.gold,
            PlayerError::NotEnoughResources
        );

        // Use overflow check anyway b/c normal sub isn't implemented
        self.resources.checked_sub(&requested_resources).unwrap();

        Ok(())
    }

    pub fn add_resources(&mut self, requested_resources: Resources) -> Result<()> {
        self.resources.checked_add(&requested_resources).unwrap();
        Ok(())
    }
}

