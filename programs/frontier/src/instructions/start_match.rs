use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::season::*;
use crate::state::structure::*;
use crate::errors::{GameMatchError, StructureError};
use anchor_lang::prelude::*;

pub fn start_match(ctx: Context<StartMatch>, _season_id: u32, _match_id: u32, _pvp_structure_id: u32) -> Result<()> {
    let pvp_structure  = & ctx.accounts.defending_pvp_structure;
    require!(pvp_structure.is_initialized, StructureError::NotInitialized);
    require!(pvp_structure.structure_type == StructureType::PvpPortal, GameMatchError::InvalidDefenderPvpPortal);

    let season_account = &mut ctx.accounts.season_account;
    let atacking_army = & ctx.accounts.attacking_army;
    let defending_base = & ctx.accounts.defending_base;
    let match_attacking_army = & ctx.accounts.match_attacking_army;
    let match_defending_base = & ctx.accounts.match_defending_base;

    season_account.add_match()?;
    
    ctx.accounts.game_match.init(
        season_account.match_count,
        match_attacking_army.key(),
        match_defending_base.key(),
    )?;
    ctx.accounts.match_defending_base.init(
        ctx.accounts.game_match.key(),
        defending_base.faction

    )?;
    ctx.accounts.match_attacking_army.init(
        ctx.accounts.game_match.key(),
        atacking_army.faction
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, pvp_structure_id: u32)]
pub struct StartMatch<'info> {
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
    #[account(
        init,
        payer=attacker,
        seeds=["base".as_bytes(), game_match.key().as_ref(), defender_account.key().as_ref()],
        bump,
        space=1000
    )]
    pub match_defending_base: Account<'info, PlayerBase>,
    #[account(
        init,
        payer=attacker,
        seeds=["army".as_bytes(), game_match.key().as_ref(), attacker_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub match_attacking_army: Account<'info, Army>,

    // program accounts
    pub system_program: Program<'info, System>,
}
