use crate::state::Resources;
use anchor_lang::prelude::*;

// This may become to large to store in the program, if so need to store in an account
// #[account]
pub struct StructureCost {
    // initializer: Pubkey,
    // version: u8,
    // is_initialized: bool,
    // manor: [Resources; 5],
    // lumber_mill: [Resources; 5],
    // quarry: [Resources; 5],
    // mystic_well: [Resources; 5],
    // watch_tower: [Resources; 5],
    // castle: [Resources; 5],
}

impl StructureCost {
    pub const VERSION: u8 = 0;
    pub const THRONE_HALL_BASE_COST: Resources = Resources {
        wood: 0,
        stone: 0,
        iron: 0,
        steel: 0,
        mana: 0,
        gold: 0,
    };
    pub const QUARRY_BASE_COST: Resources = Resources {
        wood: 100,
        stone: 100,
        iron: 0,
        steel: 0,
        mana: 0,
        gold: 0,
    };
    pub const LUMBER_MILL_BASE_COST: Resources = Resources {
        wood: 100,
        stone: 100,
        iron: 0,
        steel: 0,
        mana: 0,
        gold: 0,
    };
    pub const MINE_BASE_COST: Resources = Resources {
        wood: 50,
        stone: 250,
        iron: 0,
        steel: 0,
        mana: 0,
        gold: 0,
    };
    pub const BARRACKS_BASE_COST: Resources = Resources {
        wood: 500,
        stone: 200,
        iron: 0,
        steel: 0,
        mana: 0,
        gold: 0,
    };
    // pub const CARPENTER_HUT_BASE_COST: Resources = Resources { wood: 750, stone: 200, iron: 0, steel: 0, mana: 0, gold: 0 };
    // pub const BLACKSMITH_BASE_COST: Resources = Resources { wood: 750, stone: 250, iron: 0, steel: 0, mana: 0, gold: 0 };
    // pub const MANA_WELL_BASE_COST: Resources = Resources { wood: 150, stone: 750, iron: 0, steel: 0, mana: 0, gold: 0 };
    pub const PVP_PORTAL_BASE_COST: Resources = Resources {
        wood: 500,
        stone: 500,
        iron: 0,
        steel: 0,
        mana: 0,
        gold: 0,
    };

    pub fn get_cost(&mut self, structure_type: StructureType) -> Some<Resources> {
        match structure_type {
            StructureType::ThroneHall => Some(THRONE_HALL_BASE_COST),
            StructureType::Barracks => Some(BARRACKS_BASE_COST),
            // StructureType::Blacksmith => Some(BLACKSMITH_BASE_COST),
            // StructureType::ManaWell => Some(MANA_WELL_BASE_COST),
            // StructureType::CarpenterHut => Some(CARPENTER_HUT_BASE_COST),
            StructureType::PvpPortal => Some(PVP_PORTAL_BASE_COST),
            StructureType::Mine => Some(MINE_BASE_COST),
            StructureType::Quarry => Some(QUARRY_BASE_COST),
            StructureType::LumberMill => Some(LUMBER_MILL_BASE_COST),
            // StructureType::ArcherTower => Some(self.castle[0]),
            // StructureType::MageTower => Some(self.castle[0]),
            // StructureType::Wall => Some(self.castle[0]),
            // StructureType::SentryCreature => Some(self.castle[0]),
            _ => None,
        }
    }
}

// NOTE: enum order cannot be changed, only extended
pub enum StructureType {
    // --- Utility ---
    ThroneHall,
    Barracks,
    Blacksmith,   // after beta
    ManaWell,     // after beta
    CarpenterHut, // after beta
    PvpPortal,
    // --- Resource ---
    Mine,
    Quarry,
    LumberMill,
    // --- Defensive ---
    ArcherTower,
    MageTower,
    Wall,
    SentryCreature,
}
