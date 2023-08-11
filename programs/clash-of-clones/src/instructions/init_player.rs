use crate::state::player::*;
use anchor_lang::prelude::*;

pub fn init_player(ctx: Context<InitPlayer>) -> Result<()> {
    ctx.accounts.player_account.init(
        ctx.accounts.owner.key(),
        ctx.accounts.base_account.key()
    )
}

#[derive(Accounts)]
pub struct InitPlayer<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer=owner,
        seeds=["player".as_bytes(), owner.key().as_ref()],
        bump,
        space=1000,
    )]
    pub player_account: Account<'info, Player>,
    #[account(
        init,
        payer=owner,
        seeds=["base".as_bytes(), owner.key().as_ref()],
        bump,
        space=1000,
    )]
    pub base_account: Account<'info, Player>,
    pub system_program: Program<'info, System>,
}
