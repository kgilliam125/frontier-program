use crate::errors::UnitError;
use anchor_lang::prelude::*;

#[account]
pub struct Unit {
    id: u32,
    player: Pubkey,
    army: Pubkey,
    pub unit_type: UnitType,
    pub stats: UnitStats,
    is_destroyed: bool,
    is_initialized: bool,
}

impl Unit {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn get_base_stats(unit_type: UnitType) -> UnitStats {
        // Setting defense to 0 for now, will be used later
        match unit_type {
            UnitType::Soldier => UnitStats {
                rank: 1,
                health: 100,
                attack: 10,
                defense: 0,
                speed: 10,
                range: 1,
            },
            UnitType::Archer => UnitStats {
                rank: 1,
                health: 80,
                attack: 10,
                defense: 0,
                speed: 10,
                range: 10,
            },
            UnitType::Siege => UnitStats {
                rank: 1,
                health: 100,
                attack: 50,
                defense: 0,
                speed: 10,
                range: 20,
            },
            UnitType::Healer => UnitStats {
                rank: 1,
                health: 50,
                attack: 10,
                defense: 0,
                speed: 10,
                range: 10,
            },
        }
    }

    pub fn init(
        &mut self,
        player: Pubkey,
        army: Pubkey,
        unit_id: u32,
        unit_type: UnitType,
        unit_stats: UnitStats,
    ) -> Result<()> {
        require_eq!(self.is_initialized, false, UnitError::AlreadyInitialized);

        self.id = unit_id;
        self.player = player.key();
        self.army = army.key();
        self.unit_type = unit_type;
        self.is_initialized = true;
        self.is_destroyed = false;
        self.stats = unit_stats;

        Ok(())
    }

    pub fn try_take_damage(&mut self, attacking_power: u16) -> Result<()> {
        require!(self.is_initialized, UnitError::NotInitialized);
        // todo need to add checks for which units can attack which structures. now its an ffa

        let damage = attacking_power;
        let defense = self.stats.defense;

        let damage_taken = if damage > defense {
            damage - defense
        } else {
            0
        };

        self.stats.health = self.stats.health.saturating_sub(damage_taken);

        if self.stats.health == 0 {
            self.is_destroyed = true;
        }

        Ok(())
    }

    pub fn can_attack(&self) -> bool {
        if self.is_destroyed {
            return false;
        }

        match self.unit_type {
            UnitType::Soldier => true,
            UnitType::Archer => true,
            UnitType::Siege => true,
            UnitType::Healer => false,
        }
    }
}

// Using the same stats for all structures, so not all
// will be used. Likely want to separate into instructions
// per structure class at some point
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub struct UnitStats {
    pub rank: u16,
    pub health: u16,
    pub attack: u16,
    pub defense: u16,
    pub speed: u16,
    pub range: u16,
}

// NOTE: enum order cannot be changed, only extended
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub enum UnitType {
    Soldier,
    Archer,
    Siege,
    Healer,
}
