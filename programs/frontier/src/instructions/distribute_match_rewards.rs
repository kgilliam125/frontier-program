use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::season::*;
use crate::state::MatchState;
use anchor_lang::prelude::*;

// only attackers can get rewards so leave this as is 
pub fn distribute_match_rewards(
    ctx: Context<DistributeMatchRewards>,
    _season_id: u32,
    _match_id: u32,
) -> Result<()> {
    let game_match = &mut ctx.accounts.game_match;
    let attacker = &mut ctx.accounts.attacker_account;

    game_match.can_distribute_rewards()?;
    attacker.add_resources(game_match.match_reward)?;
    game_match.try_transition_state(MatchState::Completed)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32)]
pub struct DistributeMatchRewards<'info> {
    // attacker accounts
    #[account(mut)]
    pub attacker: Signer<'info>,
    #[account(
        seeds=["player".as_bytes(), attacker.key().as_ref()],
        bump,
    )]
    pub attacker_account: Account<'info, Player>,
    #[account(
        mut,
        seeds=["army".as_bytes(), attacker_account.key().as_ref()],
        bump,
    )]
    pub attacking_army: Account<'info, Army>,

    // defender accounts
    /// CHECK: Used for PDA validation and derivation of the various defender accounts
    pub defender: UncheckedAccount<'info>,
    #[account(
        seeds=["player".as_bytes(), defender.key().as_ref()],
        bump,
    )]
    pub defender_account: Account<'info, Player>,
    #[account(
        seeds=["base".as_bytes(), defender_account.key().as_ref()],
        bump,
    )]
    pub defending_base: Account<'info, PlayerBase>,

    // game accounots used for match
    /// CHECK: Used for PDA validation and derivation of the various game accounts
    pub season_owner: UncheckedAccount<'info>,
    #[account(
        seeds=["season".as_bytes(), season_id.to_le_bytes().as_ref(), season_owner.key().as_ref()],
        bump,
    )]
    pub season_account: Account<'info, Season>,
    #[account(
        mut,
        seeds=[match_id.to_le_bytes().as_ref(), season_account.key().as_ref(), attacking_army.key().as_ref(), defending_base.key().as_ref()],
        bump,
    )]
    pub game_match: Account<'info, GameMatch>,
}
