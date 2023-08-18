use crate::state::season::*;
use anchor_lang::prelude::*;

pub fn init_season(ctx: Context<InitSeason>, season_id: u32) -> Result<()> {
    ctx.accounts
        .season_account
        .init(ctx.accounts.owner.key(), season_id)?;
    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32)]
pub struct InitSeason<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer=owner,
        seeds=["season".as_bytes(), season_id.to_le_bytes().as_ref(), owner.key().as_ref()],
        bump,
        space=1000,
    )]
    pub season_account: Account<'info, Season>,
    pub system_program: Program<'info, System>,
}
