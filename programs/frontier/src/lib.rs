use anchor_lang::prelude::*;
use instructions::*;
use state::{Position, StructureType, UnitType};

pub mod errors;
pub mod instructions;
pub mod state;

// declare_id!("Fk8C6UUGGZgWHXmb6HPHNhfnBhf4eKDzNnj4R8zMjHCr");
declare_id!("3FKoVbicsX7moGuqVPCY1qkZ4adA85tTpYVFEe9Vs2ei");

#[program]
pub mod frontier {
    use super::*;

    pub fn init_player_accounts(ctx: Context<InitPlayerAccounts>) -> Result<()> {
        instructions::init_player_accounts::init_player_accounts(ctx)
    }

    pub fn build_structure(
        ctx: Context<BuildStructure>,
        structure_count: u32,
        structure_type: StructureType,
        position: Position,
    ) -> Result<()> {
        instructions::build_structure::build_structure(
            ctx,
            structure_count,
            structure_type,
            position,
        )
    }

    pub fn collect_resources(ctx: Context<CollectResources>, structure_count: u32) -> Result<()> {
        instructions::collect_resources::collect_resources(ctx, structure_count)
    }

    pub fn move_structure(
        ctx: Context<MoveStructure>,
        structure_count: u32,
        new_pos: Position,
    ) -> Result<()> {
        instructions::move_structure::move_structure(ctx, structure_count, new_pos)
    }

    pub fn assign_worker(
        ctx: Context<AssignWorker>,
        from_structure_count: u32,
        to_structure_count: u32,
    ) -> Result<()> {
        instructions::assign_worker::assign_worker(ctx, from_structure_count, to_structure_count)
    }

    pub fn train_unit(ctx: Context<TrainUnit>, unit_count: u32, unit_type: UnitType) -> Result<()> {
        instructions::train_unit::train_unit(ctx, unit_count, unit_type)
    }
}
