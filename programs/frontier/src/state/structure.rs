use crate::errors::StructureError;
use anchor_lang::prelude::*;

#[account]
pub struct Structure {
    id: u32,
    player_base: Pubkey,
    player: Pubkey,
    rank: u32,
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

        self.id = id;
        self.player = player_pubkey;
        self.player_base = base_pubkey;
        self.is_initialized = true;
        self.rank = 0;
        self.structure_type = structure_type;
        self.stats = StructureStats {
            level: 0,
            health: 100,
            attack: 0,
            defense: 0,
            speed: 0,
            range: 0,
            assigned_workers: 0,
            last_interaction_time: 0,
        };
        self.position = position;

        Ok(())
    }
}

// Using the same stats for all structures, so not all
// will be used. Likely want to separate into instructions
// per structure class at some point
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StructureStats {
    pub level: u32,
    pub health: u32,
    pub attack: u32,
    pub defense: u32,
    pub speed: u32,
    pub range: u32,
    pub assigned_workers: u32,
    pub last_interaction_time: i64, // UnixTimestamp as i64 or IDL will fail
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Position {
    pub x: u32,
    pub y: u32,
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
