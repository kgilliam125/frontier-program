use crate::state::Resources;
use anchor_lang::prelude::*;

// Eventually this will be too large for one account, so we will need to split it up
#[account]
pub struct StructureCost {
    initializer: Pubkey,
    version: u8,
    is_initialized: bool,
    manor: [Resources; 5],
    lumber_mill: [Resources; 5],
    quarry: [Resources; 5],
    mystic_well: [Resources; 5],
    watch_tower: [Resources; 5],
    castle: [Resources; 5],
}

impl StructureCost {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;
    pub const VERSION: u8 = 0;

    pub fn init(&mut self, owner_pubkey: Pubkey) -> Result<()> {
        require_eq!(self.is_initialized, false, PlayerError::AlreadyInitialized);

        self.initializer = owner_pubkey;
        self.is_initialized = true;
        self.version = Self::VERSION;
        self.manor = [
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 0 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 2000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 4000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 8000 },
        ];
        self.lumber_mill = [
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 500 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 800 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1500 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 2500 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 4000 },
        ];
        self.quarry = [
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 600 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1800 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 3200 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 5000 },
        ];
        self.mystic_well = [
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 800 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1200 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 2000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 3500 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 5500 },
        ];
        self.watch_tower = [
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 700 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1100 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1700 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 2600 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 4000 },
        ];
        self.castle = [
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 1000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 2000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 4000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 8000 },
            Resources { wood: 0, stone: 0, iron: 0, food: 0, gold: 16000 },
        ];

        Ok(())
    }
}
