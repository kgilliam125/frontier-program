use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::season::*;
use crate::state::structure::*;
use crate::state::unit::*;
use anchor_lang::prelude::*;

// The defending structure attacks the attacking unit
pub fn attack_unit(
    ctx: Context<AttackUnit>,
    _season_id: u32,
    _match_id: u32,
    _match_unit_id: u32,
    _match_structure_id: u32,
) -> Result<()> {
    let defending_match_structure = & ctx.accounts.defending_match_structure;
    let attacking_match_unit = &mut ctx.accounts.attacking_match_unit;

    let can_attack = defending_match_structure.can_attack();

    if can_attack {
        attacking_match_unit.try_take_damage(defending_match_structure.stats.attack)?;
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, match_unit_id: u32, match_structure_id: u32)]
pub struct AttackUnit<'info> {
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
    #[account(
        seeds=["army".as_bytes(), game_match.key().as_ref(), attacker_account.key().as_ref()],
        bump,
    )]
    pub match_attacking_army: Account<'info, Army>,
    #[account(
        mut,
        seeds=[match_unit_id.to_le_bytes().as_ref(), match_attacking_army.key().as_ref()],
        bump,
    )]
    pub attacking_match_unit: Account<'info, Unit>,
    #[account(
        seeds=["base".as_bytes(), game_match.key().as_ref(), defender_account.key().as_ref()],
        bump,
    )]
    pub match_defending_base: Account<'info, PlayerBase>,
    #[account(
        seeds=[match_structure_id.to_le_bytes().as_ref(), match_defending_base.key().as_ref()],
        bump,
    )]
    pub defending_match_structure: Account<'info, Structure>,
}
