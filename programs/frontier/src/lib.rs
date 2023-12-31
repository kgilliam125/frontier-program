use anchor_lang::prelude::*;
use instructions::*;
use state::{FactionType, MatchState, Position, StructureType, UnitType};

pub mod errors;
pub mod instructions;
pub mod state;

// declare_id!("Fk8C6UUGGZgWHXmb6HPHNhfnBhf4eKDzNnj4R8zMjHCr");
declare_id!("3FKoVbicsX7moGuqVPCY1qkZ4adA85tTpYVFEe9Vs2ei");

#[program]
pub mod frontier {
    use super::*;

    // game setup instructions
    pub fn init_season(ctx: Context<InitSeason>, season_id: u32) -> Result<()> {
        instructions::init_season::init_season(ctx, season_id)
    }

    pub fn init_player_accounts(
        ctx: Context<InitPlayerAccounts>,
        faction: FactionType,
    ) -> Result<()> {
        instructions::init_player_accounts::init_player_accounts(ctx, faction)
    }

    // Base building instructions
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

    // attacking instructions
    pub fn start_match(
        ctx: Context<StartMatch>,
        season_id: u32,
        match_id: u32,
        pvp_structure_id: u32,
    ) -> Result<()> {
        instructions::start_match::start_match(ctx, season_id, match_id, pvp_structure_id)
    }

    pub fn add_structure_to_match(
        ctx: Context<AddStructureToMatch>,
        season_id: u32,
        match_id: u32,
        added_structure_id: u32,
        match_structure_id: u32,
    ) -> Result<()> {
        instructions::add_structure_to_match::add_structure_to_match(
            ctx,
            season_id,
            match_id,
            added_structure_id,
            match_structure_id,
        )
    }

    pub fn add_unit_to_match(
        ctx: Context<AddUnitToMatch>,
        season_id: u32,
        match_id: u32,
        added_unit_id: u32,
        match_unit_id: u32,
    ) -> Result<()> {
        instructions::add_unit_to_match::add_unit_to_match(
            ctx,
            season_id,
            match_id,
            added_unit_id,
            match_unit_id,
        )
    }

    pub fn transition_match_state(
        ctx: Context<TransitionMatchState>,
        season_id: u32,
        match_id: u32,
        match_state: MatchState,
    ) -> Result<()> {
        instructions::transition_match_state::transition_match_state(ctx, season_id, match_id, match_state)
    }

    pub fn attack_structure(
        ctx: Context<AttackStructure>,
        season_id: u32,
        match_id: u32,
        match_unit_id: u32,
        match_structure_id: u32,
    ) -> Result<()> {
        instructions::attack_structure::attack_structure(
            ctx,
            season_id,
            match_id,
            match_unit_id,
            match_structure_id,
        )
    }

    pub fn attack_unit(
        ctx: Context<AttackUnit>,
        season_id: u32,
        match_id: u32,
        match_unit_id: u32,
        match_structure_id: u32,
    ) -> Result<()> {
        instructions::attack_unit::attack_unit(
            ctx,
            season_id,
            match_id,
            match_unit_id,
            match_structure_id,
        )
    }

    pub fn distribute_match_rewards(
        ctx: Context<DistributeMatchRewards>,
        season_id: u32,
        match_id: u32,
    ) -> Result<()> {
        instructions::distribute_match_rewards::distribute_match_rewards(ctx, season_id, match_id)
    }
}
