use crate::state::player::*;
use crate::state::unit::*;
use crate::state::army::*;
use crate::state::player_base::*;
use crate::state::structure::*;
use anchor_lang::prelude::*;

pub fn attack_structure(
    ctx: Context<AttackStructure>,
    _unit_count: u32,
    _structure_count: u32
) -> Result<()> {

    Ok(())
}

#[derive(Accounts)]
#[instruction(unit_count: u32, structure_count: u32)]
pub struct AttackStructure<'info> {
    #[account(mut)]
    pub attacker: Signer<'info>,
    #[account(
        mut,
        seeds=["player".as_bytes(), attacker.key().as_ref()],
        bump,
    )]
    pub defender: Account<'info, Player>,
    #[account(
        mut,
        seeds=["army".as_bytes(), player_account.key().as_ref()],
        bump,
    )]
    pub army_account: Account<'info, Army>,
    #[account(
        mut,
        seeds=["base".as_bytes(), player_account.key().as_ref()],
        bump,
    )]
    pub army_account: Account<'info, PlayerBase>,
    #[account(
        seeds=[unit_count.to_le_bytes().as_ref(), army_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub attacking_unit: Account<'info, Unit>,
    #[account(
        mut,
        seeds=[structure_count.to_le_bytes().as_ref(), base_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub defending_structure: Account<'info, Structure>,
    #[account(
        init,
        seeds=[match_id.to_le_bytes().as_ref(), season_account.as_ref(), attacking_army.key().as_ref(), defending_base.key().as_ref],
        bump,
        payer=attacker,
        space=1000,
    )]
    pub game_match: Account<'info, GameMatch>,
}
