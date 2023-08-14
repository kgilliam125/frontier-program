use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Resources {
    pub wood: u32,
    pub stone: u32,
    pub iron: u32,
    pub steel: u32,
    pub mana: u32,
    pub gold: u32,
}

impl Resources {
    pub const SIZE: usize = 24;
}

impl Default for Resources {
    fn default() -> Self {
        Self {
            wood: 0,
            stone: 0,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        }
    }
}
