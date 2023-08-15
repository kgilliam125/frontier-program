use crate::state::Resources;
use crate::state::StructureType;

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

pub fn get_cost(structure_type: StructureType) -> Resources {
    match structure_type {
        StructureType::ThroneHall => THRONE_HALL_BASE_COST,
        StructureType::Barracks => BARRACKS_BASE_COST,
        StructureType::Blacksmith => BLACKSMITH_BASE_COST,
        StructureType::ManaWell => MANA_WELL_BASE_COST,
        StructureType::CarpenterHut => CARPENTER_HUT_BASE_COST,
        StructureType::PvpPortal => PVP_PORTAL_BASE_COST,
        StructureType::Mine => MINE_BASE_COST,
        StructureType::Quarry => QUARRY_BASE_COST,
        StructureType::LumberMill => LUMBER_MILL_BASE_COST,
        StructureType::ArcherTower => ARCHER_TOWER_BASE_COST,
        StructureType::MageTower => MAGE_TOWER_BASE_COST,
        StructureType::Wall => WALL_BASE_COST,
        StructureType::SentryCreature => SENTRY_CREATURE_BASE_COST,
    }
}
