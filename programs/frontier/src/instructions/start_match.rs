use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::army::*;
use anchor_lang::prelude::*;

pub fn start_match(ctx: Context<StartMatch>, match_id: u64) -> Result<()> {
    ctx.accounts.game_match.init(
        match_id,
        attacking_army,
        defending_base,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct StartMatch<'info> {
    #[account(mut)]
    pub attacker: Signer<'info>,
    #[account(
        seeds=["player".as_bytes(), attacker.key().as_ref()],
        bump,
        space=1000,
    )]
    pub attacker_account: Account<'info, Player>,
    #[account(
        seeds=["army".as_bytes(), attacker_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub attacking_army: Account<'info, Army>,
    pub defender: UncheckedAccount<'info>,
    #[account(
        seeds=["player".as_bytes(), defender.key().as_ref()],
        bump,
        space=1000,
    )]
    pub defender_account: Account<'info, Player>,
    #[account(
        seeds=["base".as_bytes(), defender_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub defending_base: Account<'info, PlayerBase>,
    #[account(
        init,
        seeds=["match".as_bytes(), attacker_account.key().as_ref(), defender_account.key().as_ref],
        bump,
        payer=attacker,
        space=1000,
    )]
    pub game_match: Account<'info, GameMatch>,
    pub system_program: Program<'info, System>,
}
