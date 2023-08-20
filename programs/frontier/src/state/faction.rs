use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq)]
pub enum FactionType {
    Orc,
    Lizardmen,
    Fishmen,
}
