use anchor_lang::prelude::*;
use instructions::*;

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
    
    // ture(ctx: Context<BuildStructure>, structure_count: u32, structure_type: u32) 
    pub fn build_structure(ctx: Context<BuildStructure>, structure_count: u32, structure_type: u32) -> Result<()> {
        instructions::build_structure::build_structure(ctx, structure_count, structure_type)
    }
}

// #[derive(Accounts)]
// pub struct InitBase<'info> {
//     #[account(mut)]
//     pub player: Signer<'info>,
//     #[account(
//         init,
//         payer=player,
//         seeds=["base".as_bytes(), player.key().as_ref()],
//         bump,
//         space=1000,
//     )]
//     pub base_state: Account<'info, BaseState>,
//     pub system_program: Program<'info, System>,
// }

// #[account]
// pub struct BaseState {
//     player: Pubkey,
//     // Consider storing only pubkeys or empty string, address refers to account storing state
//     // of the grid entity. This could allow for updating individual grid entities without
//     // a need to update the entire grid
//     base_grid: [BaseGridState; BOARD_TILES],
//     is_initialized: bool,
// }

// #[account]
// #[derive(
//     AnchorSerialize,
//     AnchorDeserialize,
//     Copy,
//     Clone,
// )]
// pub struct BaseGridState {
//     value: i32,
// }

// #[account]
// pub struct BaseGridEntity {
//     base: Pubkey,
//     player: Pubkey,
//     level: u32,
//     position: u32 // computed array index position
// }
