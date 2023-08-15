use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::structure::*;
use anchor_lang::prelude::*;

pub fn collect_resources(
    ctx: Context<CollectResources>,
    _structure_count: u32,
) -> Result<()> {
    let player_account = &mut ctx.accounts.player_account;
    let structure_account = &mut ctx.accounts.structure_account;

    // player_account.add_resources()?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(structure_count: u32)]
pub struct CollectResources<'info> {
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
        seeds=[structure_count.to_le_bytes().as_ref(), base_account.key().as_ref()],
        bump,
    )]
    pub structure_account: Account<'info, Structure>,
}
