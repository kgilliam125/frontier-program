use crate::state::army::*;
use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::structure::*;
use crate::state::unit::*;
use crate::state::season::*;
use crate::state::game_match::*;
use anchor_lang::prelude::*;

pub fn attack_structure(
    ctx: Context<AttackStructure>,
    _season_id: u32,
    _match_id: u32,
    _unit_count: u32,
    _structure_count: u32,
) -> Result<()> {
    let defending_structure = &mut ctx.accounts.defending_structure;
    let attacking_unit = &ctx.accounts.attacking_unit;

    defending_structure.try_take_damage(attacking_unit.stats.attack)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, unit_count: u32, structure_count: u32)]
pub struct AttackStructure<'info> {
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
    #[account(
        seeds=[unit_count.to_le_bytes().as_ref(), attacking_army.key().as_ref()],
        bump,
    )]
    pub attacking_unit: Account<'info, Unit>,

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
        mut,
        seeds=[structure_count.to_le_bytes().as_ref(), defending_base.key().as_ref()],
        bump,
    )]
    pub defending_structure: Account<'info, Structure>,

    // game accounots
    /// CHECK: Used for PDA validation and derivation of the various game accounts
    pub season_owner: UncheckedAccount<'info>,
    #[account(
        seeds=["season".as_bytes(), season_id.to_le_bytes().as_ref(), season_owner.key().as_ref()],
        bump,
    )]
    pub season_account: Account<'info, Season>,
    #[account(
        seeds=[match_id.to_le_bytes().as_ref(), season_account.key().as_ref(), attacking_army.key().as_ref(), defending_base.key().as_ref()],
        bump,
    )]
    pub game_match: Account<'info, GameMatch>,
}
