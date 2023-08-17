use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::structure::*;
use anchor_lang::prelude::*;

pub fn assign_worker(
    ctx: Context<AssignWorker>,
    _from_structure_count: u32,
    _to_structure_count: u32,
) -> Result<()> {
    // let player_account = &mut ctx.accounts.player_account;
    // let base_account = &mut ctx.accounts.base_account;
    let from_structure_account = &mut ctx.accounts.from_structure_account;
    let to_structure_account = &mut ctx.accounts.to_structure_account;

    from_structure_account.remove_worker()?;
    to_structure_account.add_worker()?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(from_structure_count: u32, to_structure_count: u32)]
pub struct AssignWorker<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
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
        seeds=[from_structure_count.to_le_bytes().as_ref(), base_account.key().as_ref()],
        bump,
    )]
    pub from_structure_account: Account<'info, Structure>,
    #[account(
        mut,
        seeds=[to_structure_count.to_le_bytes().as_ref(), base_account.key().as_ref()],
        bump,
    )]
    pub to_structure_account: Account<'info, Structure>,
}
