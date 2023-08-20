use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::season::*;
use crate::state::structure::*;
use crate::errors::{GameMatchError, StructureError};
use anchor_lang::prelude::*;

pub fn transition_match_state(ctx: Context<TransitionMatchState>, _season_id: u32, _match_id: u32, _pvp_structure_id: u32, requested_state: MatchState) -> Result<()> {
    let game_match = &mut ctx.accounts.game_match;

    game_match.try_transition_state(requested_state)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, pvp_structure_id: u32)]
pub struct TransitionMatchState<'info> {
    // attacker accounts
    #[account(mut)]
    pub attacker: Signer<'info>,
    #[account(
        seeds=["player".as_bytes(), attacker.key().as_ref()],
        bump,
    )]
    pub attacker_account: Account<'info, Player>,
    #[account(
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
        mut,
        seeds=["season".as_bytes(), season_id.to_le_bytes().as_ref(), season_owner.key().as_ref()],
        bump,
    )]
    pub season_account: Account<'info, Season>,
    #[account(
        init,
        seeds=[match_id.to_le_bytes().as_ref(), season_account.key().as_ref(), attacking_army.key().as_ref(), defending_base.key().as_ref()],
        bump,
        payer=attacker,
        space=1000,
    )]
    pub game_match: Account<'info, GameMatch>,
}
