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

    pub fn checked_add(&mut self, other: &Resources) -> Result<()> {
        self.wood = self.wood.checked_add(other.wood).unwrap_or(u32::MAX);
        self.stone = self.stone.checked_add(other.stone).unwrap_or(u32::MAX);
        self.iron = self.iron.checked_add(other.iron).unwrap_or(u32::MAX);
        self.steel = self.steel.checked_add(other.steel).unwrap_or(u32::MAX);
        self.mana = self.mana.checked_add(other.mana).unwrap_or(u32::MAX);
        self.gold = self.gold.checked_add(other.gold).unwrap_or(u32::MAX);
        Ok(())
    }

    pub fn checked_sub(&mut self, other: &Resources) -> Result<()> {
        self.wood = self.wood.checked_sub(other.wood).unwrap_or(u32::MIN);
        self.stone = self.stone.checked_sub(other.stone).unwrap_or(u32::MIN);
        self.iron = self.iron.checked_sub(other.iron).unwrap_or(u32::MIN);
        self.steel = self.steel.checked_sub(other.steel).unwrap_or(u32::MIN);
        self.mana = self.mana.checked_sub(other.mana).unwrap_or(u32::MIN);
        self.gold = self.gold.checked_sub(other.gold).unwrap_or(u32::MIN);
        Ok(())
    }
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
