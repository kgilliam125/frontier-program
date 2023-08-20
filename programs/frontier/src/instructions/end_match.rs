use crate::errors::{GameMatchError, StructureError};
use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::season::*;
use crate::state::structure::*;
use anchor_lang::prelude::*;

pub fn end_match(
    ctx: Context<EndMatch>,
    _season_id: u32,
    _match_id: u32,
    _pvp_structure_id: u32,
    match_state: MatchState,
) -> Result<()> {
    let pvp_structure = &ctx.accounts.defending_pvp_structure;
    require!(pvp_structure.is_initialized, StructureError::NotInitialized);
    require!(
        pvp_structure.structure_type == StructureType::PvpPortal,
        GameMatchError::InvalidDefenderPvpPortal
    );

    let match_account = &mut ctx.accounts.game_match;

    match_account.end_match(match_state)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, pvp_structure_id: u32)]
pub struct EndMatch<'info> {
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
    #[account(
        seeds=[pvp_structure_id.to_le_bytes().as_ref(), defending_base.key().as_ref()],
        bump,
    )]
    pub defending_pvp_structure: Account<'info, Structure>,

    // game accounots
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
