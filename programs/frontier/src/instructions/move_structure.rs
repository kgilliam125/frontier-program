use crate::errors::StructureError;
use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::structure::*;
use anchor_lang::prelude::*;

pub fn move_structure(
    ctx: Context<MoveStructure>,
    _structure_count: u32,
    new_pos: Position,
) -> Result<()> {
    require_gte!(16000, new_pos.x, StructureError::InvalidPosition);
    require_gte!(16000, new_pos.y, StructureError::InvalidPosition);
    // let player_account = &mut ctx.accounts.player_account;
    // let base_account = &mut ctx.accounts.base_account;
    let structure_account = &mut ctx.accounts.structure_account;

    require!(
        structure_account.is_initialized,
        StructureError::NotInitialized
    );

    structure_account.move_structure(new_pos)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(structure_count: u32)]
pub struct MoveStructure<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        seeds=["player".as_bytes(), owner.key().as_ref()],
        bump,
    )]
    pub player_account: Account<'info, Player>,
    #[account(
        seeds=["base".as_bytes(), player_account.key().as_ref()],
        bump,
    )]
    pub base_account: Account<'info, PlayerBase>,
    #[account(
        mut,
        seeds=[structure_count.to_le_bytes().as_ref(), base_account.key().as_ref()],
        bump,
    )]
    pub structure_account: Account<'info, Structure>,
}
