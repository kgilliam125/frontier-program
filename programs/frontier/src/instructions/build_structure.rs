use crate::state::player::*;
use crate::state::player_base::*;
use crate::state::structure::*;
use anchor_lang::prelude::*;

pub fn build_structure(ctx: Context<BuildStructure>, _structure_count: u32, structure_type: u32) -> Result<()> {
    // todo add guards
    let player_account = &mut ctx.accounts.player_account;
    let base_account = &mut ctx.accounts.base_account;
    let structure_account = &mut ctx.accounts.structure_account;

    // todo implement structure cost lookup from structure_type
    let requested_resources = Resources {
        wood: 1,
        stone: 1,
        iron: 0,
        steel: 0,
        mana: 0,
        gold: 0,
    };

    player_account.subtract_resources(requested_resources)?;
    base_account.add_structure()?;

    structure_account.init(player_account.key(), base_account.key(), base_account.structure_count, structure_type)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(structure_count: u32)]
pub struct BuildStructure<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds=["player".as_bytes(), owner.key().as_ref()],
        bump,
    )]
    pub player_account: Account<'info, Player>,
    #[account(
        mut,
        seeds=["base".as_bytes(), player_account.key().as_ref()],
        bump,
    )]
    pub base_account: Account<'info, PlayerBase>,
    #[account(
        init,
        payer=owner,
        seeds=[structure_count.to_le_bytes().as_ref(), base_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub structure_account: Account<'info, Structure>,
    pub system_program: Program<'info, System>,
}
