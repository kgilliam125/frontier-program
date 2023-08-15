use anchor_lang::error_code;

#[error_code]
pub enum PlayerError {
    AlreadyInitialized,
    NotInitialized,
    NotEnoughResources,
}

#[error_code]
pub enum BaseError {
    AlreadyInitialized,
    NotInitialized,
    BaseSizeExceeded,
    MaxRatingExceeded,
    NoStructures
}

#[error_code]
pub enum ArmyError {
    AlreadyInitialized,
    NotInitialized,
}

#[error_code]
pub enum GameMatchError {
    AlreadyInitialized,
    NotInitialized,
}

#[error_code]
pub enum StructureError {
    AlreadyInitialized,
    NotInitialized,
    InvalidPosition,
    CollectionTimerNotExpired,
}

#[error_code]
pub enum UnitError {
    AlreadyInitialized,
    NotInitialized,
}
