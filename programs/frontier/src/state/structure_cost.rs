use crate::state::Resources;

// This may become to large to store in the program, if so need to store in an account

const THRONE_HALL_BASE_COST: Resources = Resources {
    wood: 0,
    stone: 0,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const QUARRY_BASE_COST: Resources = Resources {
    wood: 100,
    stone: 100,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const LUMBER_MILL_BASE_COST: Resources = Resources {
    wood: 100,
    stone: 100,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const MINE_BASE_COST: Resources = Resources {
    wood: 50,
    stone: 250,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const BARRACKS_BASE_COST: Resources = Resources {
    wood: 500,
    stone: 200,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const CARPENTER_HUT_BASE_COST: Resources = Resources {
    wood: 750,
    stone: 200,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const BLACKSMITH_BASE_COST: Resources = Resources {
    wood: 750,
    stone: 250,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const MANA_WELL_BASE_COST: Resources = Resources {
    wood: 150,
    stone: 750,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const PVP_PORTAL_BASE_COST: Resources = Resources {
    wood: 500,
    stone: 500,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const ARCHER_TOWER_BASE_COST: Resources = Resources {
    wood: 0,
    stone: 0,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const MAGE_TOWER_BASE_COST: Resources = Resources {
    wood: 0,
    stone: 0,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const WALL_BASE_COST: Resources = Resources {
    wood: 0,
    stone: 0,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};
const SENTRY_CREATURE_BASE_COST: Resources = Resources {
    wood: 0,
    stone: 0,
    iron: 0,
    steel: 0,
    mana: 0,
    gold: 0,
};

pub fn get_cost(structure_type: StructureType) -> Option<Resources> {
    match structure_type {
        StructureType::ThroneHall => Some(THRONE_HALL_BASE_COST),
        StructureType::Barracks => Some(BARRACKS_BASE_COST),
        StructureType::Blacksmith => Some(BLACKSMITH_BASE_COST),
        StructureType::ManaWell => Some(MANA_WELL_BASE_COST),
        StructureType::CarpenterHut => Some(CARPENTER_HUT_BASE_COST),
        StructureType::PvpPortal => Some(PVP_PORTAL_BASE_COST),
        StructureType::Mine => Some(MINE_BASE_COST),
        StructureType::Quarry => Some(QUARRY_BASE_COST),
        StructureType::LumberMill => Some(LUMBER_MILL_BASE_COST),
        StructureType::ArcherTower => Some(ARCHER_TOWER_BASE_COST),
        StructureType::MageTower => Some(MAGE_TOWER_BASE_COST),
        StructureType::Wall => Some(WALL_BASE_COST),
        StructureType::SentryCreature => Some(SENTRY_CREATURE_BASE_COST),
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
