use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::season::*;
use crate::state::structure::*;
use crate::state::unit::*;
use anchor_lang::prelude::*;

pub fn attack_structure(
    ctx: Context<AttackStructure>,
    _season_id: u32,
    _match_id: u32,
    _match_unit_id: u32,
    _match_structure_id: u32,
) -> Result<()> {
    let game_match = &mut ctx.accounts.game_match;
    game_match.can_attack()?;

    let defending_match_structure = &mut ctx.accounts.defending_match_structure;
    let attacking_match_unit = &ctx.accounts.attacking_match_unit;

    let can_attack = attacking_match_unit.can_attack();

    if can_attack {
        defending_match_structure.try_take_damage(attacking_match_unit.stats.attack)?;

        if defending_match_structure.is_destroyed{
            game_match.destroy_structure(defending_match_structure.structure_type)?;
        }
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, match_unit_id: u32, match_structure_id: u32)]
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
        mut,
        seeds=["army".as_bytes(), game_match.key().as_ref(), attacker_account.key().as_ref()],
        bump,
    )]
    pub match_attacking_army: Account<'info, Army>,
    #[account(
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
        mut,
        seeds=[match_structure_id.to_le_bytes().as_ref(), match_defending_base.key().as_ref()],
        bump,
    )]
    pub defending_match_structure: Account<'info, Structure>,
}
