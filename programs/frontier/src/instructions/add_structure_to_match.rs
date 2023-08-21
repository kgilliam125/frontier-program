use crate::state::army::*;
use crate::state::game_match::*;
use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::season::*;
use crate::state::structure::*;
use anchor_lang::prelude::*;

pub fn add_structure_to_match(
    ctx: Context<AddStructureToMatch>,
    _season_id: u32,
    _match_id: u32,
    _added_structure_id: u32,
    _match_structure_id: u32,
) -> Result<()> {
    let game_match = &mut ctx.accounts.game_match;
    let structure_to_add = &ctx.accounts.structure_to_add;
    let match_defending_base = &mut ctx.accounts.match_defending_base;
    let match_structure_account = &mut ctx.accounts.match_structure_account;

    game_match.can_add()?;

    // Ignore resource cost since this is an ephemeral account
    match_defending_base
        .add_structure_to_base(structure_to_add.structure_type, structure_to_add.stats)?;
    match_structure_account.init(
        game_match.key(),
        match_defending_base.key(),
        match_defending_base.structure_count,
        structure_to_add.stats,
        structure_to_add.structure_type,
        structure_to_add.position,
    )?;
    game_match.add_structure(structure_to_add.structure_type, structure_to_add.stats.rank)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(season_id: u32, match_id: u32, added_structure_id: u32, match_structure_id: u32)]
pub struct AddStructureToMatch<'info> {
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
        seeds=[added_structure_id.to_le_bytes().as_ref(), defending_base.key().as_ref()],
        bump,
    )]
    pub structure_to_add: Account<'info, Structure>,

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
    #[account(
        mut,
        seeds=["base".as_bytes(), game_match.key().as_ref(), defender_account.key().as_ref()],
        bump,
    )]
    pub match_defending_base: Account<'info, PlayerBase>,
    #[account(
        init,
        payer=attacker,
        seeds=[match_structure_id.to_le_bytes().as_ref(), match_defending_base.key().as_ref()],
        bump,
        space=1000,
    )]
    pub match_structure_account: Account<'info, Structure>,

    // program accounts
    pub system_program: Program<'info, System>,
}
