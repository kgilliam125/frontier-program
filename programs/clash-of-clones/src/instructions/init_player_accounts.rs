use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::army::*;
use anchor_lang::prelude::*;

pub fn init_player_accounts(ctx: Context<InitPlayerAccounts>) -> Result<()> {
    ctx.accounts.player_account.init(
        ctx.accounts.owner.key(),
    ).unwrap();
    ctx.accounts.base_account.init(
        ctx.accounts.player_account.key(),
    ).unwrap();
    ctx.accounts.army_account.init(
        ctx.accounts.player_account.key(),
    ).unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct InitPlayerAccounts<'info> {
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
        seeds=["base".as_bytes(), player_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub base_account: Account<'info, PlayerBase>,
    #[account(
        init,
        payer=owner,
        seeds=["army".as_bytes(), player_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub army_account: Account<'info, Army>,
    pub system_program: Program<'info, System>,
}
