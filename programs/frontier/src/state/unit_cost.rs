use crate::state::Resources;
use crate::state::UnitType;

// Just making up some numbers for now
const SOLDIER_BASE_COST: Resources = Resources {
    wood: 0,
    stone: 0,
    iron: 100,
    steel: 0,
    mana: 0,
    gold: 100,
};
const ARCHER_BASE_COST: Resources = Resources {
    wood: 50,
    stone: 0,
    iron: 50,
    steel: 0,
    mana: 0,
    gold: 100,
};
const HEALER_BASE_COST: Resources = Resources {
    wood: 100,
    stone: 0,
    iron: 0,
    steel: 0,
    mana: 100,
    gold: 200,
};
const SIEGE_BASE_COST: Resources = Resources {
    wood: 500,
    stone: 500,
    iron: 500,
    steel: 0,
    mana: 0,
    gold: 200,
};

pub fn get_cost(unit_type: UnitType) -> Resources {
    match unit_type {
        UnitType::Soldier => SOLDIER_BASE_COST,
        UnitType::Archer => ARCHER_BASE_COST,
        UnitType::Healer => HEALER_BASE_COST,
        UnitType::Siege => SIEGE_BASE_COST,
    }
}
