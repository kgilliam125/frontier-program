use crate::errors::StructureError;
use crate::state::Resources;
use anchor_lang::prelude::*;

#[account]
pub struct Structure {
    id: u32,
    player_base: Pubkey,
    player: Pubkey,
    structure_type: StructureType, // todo check if enum extension breaks pre-existing accounts
    stats: StructureStats,
    position: Position,
    is_initialized: bool,
}

impl Structure {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;
    pub const MAX_RATING: u32 = 3;

    pub fn init(
        &mut self,
        player_pubkey: Pubkey,
        base_pubkey: Pubkey,
        id: u32,
        structure_type: StructureType,
        position: Position,
    ) -> Result<()> {
        require_eq!(
            self.is_initialized,
            false,
            StructureError::AlreadyInitialized
        );

        let collection_interval = match structure_type {
            StructureType::Quarry => 60,
            StructureType::LumberMill => 60,
            StructureType::Mine => 60,
            _ => 0,
        };

        self.id = id;
        self.player = player_pubkey;
        self.player_base = base_pubkey;
        self.is_initialized = true;
        self.structure_type = structure_type;
        self.stats = StructureStats {
            rank: 1,
            health: 100,
            attack: 0,
            defense: 0,
            speed: 0,
            range: 0,
            // todo set to 1 for testing
            assigned_workers: 1,
            collection_interval,
            last_interaction_time: 0,
        };
        self.position = position;

        Ok(())
    }

    pub fn try_collect_resources(&mut self) -> Result<Resources> {
        let clock = Clock::get()?;
        let seconds_since_last_interaction =
            clock.unix_timestamp - self.stats.last_interaction_time;

        msg!("Seconds since last interaction: {}", seconds_since_last_interaction);
        msg!("Collection interval: {}", self.stats.collection_interval);
        msg!("Last interaction: {}", self.stats.last_interaction_time);

        require_gte!(
            seconds_since_last_interaction,
            self.stats.collection_interval as i64,
            StructureError::CollectionTimerNotExpired
        );

        self.stats.last_interaction_time = clock.unix_timestamp;

        Ok(self.collect_resources())
    }

    fn calculate_resource_distribution(&mut self, value: u32) -> u32 {
        let rank_multiplier = value.checked_mul(self.stats.rank as u32).unwrap_or(u32::MAX);

        rank_multiplier.checked_mul(self.stats.assigned_workers as u32).unwrap_or(u32::MAX)
    }

    fn collect_resources(&mut self) -> Resources {
        match self.structure_type {
            StructureType::Quarry => Resources {
                wood: 0,
                stone: self.calculate_resource_distribution(250),
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            },
            StructureType::LumberMill => Resources {
                wood: self.calculate_resource_distribution(250),
                stone: 0,
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            },
            StructureType::Mine => Resources {
                wood: 0,
                stone: 0,
                iron: self.calculate_resource_distribution(250),
                steel: 0,
                mana: 0,
                gold: 0,
            },
            _ => Resources {
                wood: 0,
                stone: 0,
                iron: 0,
                steel: 0,
                mana: 0,
                gold: 0,
            },
        }
    }
}

// Using the same stats for all structures, so not all
// will be used. Likely want to separate into instructions
// per structure class at some point
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StructureStats {
    pub rank: u16,
    pub health: u16,
    pub attack: u16,
    pub defense: u16,
    pub speed: u16,
    pub range: u16,
    pub assigned_workers: u8,
    pub collection_interval: u16, // seconds
    pub last_interaction_time: i64, // UnixTimestamp as i64 or IDL will fail
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Position {
    pub x: u16,
    pub y: u16,
}

// NOTE: enum order cannot be changed, only extended
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
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
