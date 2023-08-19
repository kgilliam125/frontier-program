use crate::errors::SeasonError;
use anchor_lang::prelude::*;

// There is currently one season. This account is used to track how many matches
// have occured so they can be indexed on chain. It also allows for further season
// expansion if desired.
#[account]
pub struct Season {
    season_id: u32,
    season_initializer: Pubkey,
    pub match_count: u32,
    player_count: u32,
    state: SeasonState,
    is_initialized: bool
}

impl Season {
    // Set to maximum account size to leave expansion room, find what it is
    pub const MAXIMUM_SIZE: usize = 5000;

    pub fn init(&mut self, creator: Pubkey, season_id: u32) -> Result<()> {
        require_eq!(self.is_initialized, false, SeasonError::AlreadyInitialized);

        self.season_id = season_id;
        self.season_initializer = creator;
        self.match_count = 0;
        // not currently used. This would track player accounts within a season
        // an allow encapsulation of players participating in the season
        self.player_count = 0;
        self.state = SeasonState::Open;
        self.is_initialized = true;

        Ok(())
    }

    pub fn add_match(&mut self) -> Result<()> {
        require_eq!(self.is_initialized, true, SeasonError::NotInitialized);
        require!(self.state == SeasonState::Open, SeasonError::SeasonClosed);

        self.match_count += 1;

        Ok(())
    }
}

// Using enum in case there are some other states a season could be in
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq)]
pub enum SeasonState {
    Open,
    Closed,
}