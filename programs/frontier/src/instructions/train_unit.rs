use crate::state::player::*;
use crate::state::unit::*;
use crate::state::army::*;
use crate::state::unit_cost::*;
use anchor_lang::prelude::*;

pub fn train_unit(
    ctx: Context<TrainUnit>,
    _unit_count: u32,
    unit_type: UnitType,
) -> Result<()> {
    let player_account = &mut ctx.accounts.player_account;
    let army_account = &mut ctx.accounts.army_account;
    let unit_account = &mut ctx.accounts.unit_account;

    let resource_cost = get_cost(unit_type);
    let stats = Unit::get_stats(unit_type);

    // todo: make sure production buildings are in the player_base

    player_account.subtract_resources(resource_cost)?;
    army_account.add_unit_to_army()?;
    unit_account.init(
        player_account.key(),
        army_account.key(),
        army_account.army_size, // we actually update this next, but need structure to exist first
        unit_type,
        stats
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(unit_count: u32)]
pub struct TrainUnit<'info> {
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
        seeds=["army".as_bytes(), player_account.key().as_ref()],
        bump,
    )]
    pub army_account: Account<'info, Army>,
    #[account(
        init,
        payer=owner,
        seeds=[unit_count.to_le_bytes().as_ref(), army_account.key().as_ref()],
        bump,
        space=1000,
    )]
    pub unit_account: Account<'info, Unit>,
    pub system_program: Program<'info, System>,
}
