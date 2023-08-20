use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::season::*;
use crate::state::unit::*;
use anchor_lang::prelude::*;

pub fn add_unit_to_match(
    ctx: Context<AddUnitToMatch>,
    _season_id: u32,
    _match_id: u32,
    _added_unit_id: u32,
    _match_unit_id: u32,
) -> Result<()> {
    let game_match = &ctx.accounts.game_match;
    let unit_to_add = &ctx.accounts.unit_to_add;
    let match_attacking_army = &mut ctx.accounts.match_attacking_army;
    let match_unit_account = &mut ctx.accounts.match_unit_account;

    // game_match.can_add()?;

    // Ignore resource cost since this is an ephemeral account
    match_attacking_army
        .add_unit_to_army()?;
    match_unit_account.init(
        game_match.key(),
        match_attacking_army.key(),
        match_attacking_army.army_size,
        unit_to_add.unit_type,
        unit_to_add.stats,
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, added_unit_id: u32, match_unit_id: u32)]
pub struct AddUnitToMatch<'info> {
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
        mut,
        seeds=[added_unit_id.to_le_bytes().as_ref(), attacking_army.key().as_ref()],
        bump,
    )]
    pub unit_to_add: Account<'info, Unit>,

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
        init,
        payer=attacker,
        seeds=[match_unit_id.to_le_bytes().as_ref(), match_attacking_army.key().as_ref()],
        bump,
        space=1000,
    )]
    pub match_unit_account: Account<'info, Unit>,

    // program accounts
    pub system_program: Program<'info, System>,
}
