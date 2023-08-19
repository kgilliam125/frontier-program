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
    NoStructures,
}

#[error_code]
pub enum ArmyError {
    AlreadyInitialized,
    NotInitialized,
    SizeExceeded,
    ArmyEmpty,
}

#[error_code]
pub enum GameMatchError {
    AlreadyInitialized,
    NotInitialized,
    InvalidDefenderPvpPortal,
}

#[error_code]
pub enum StructureError {
    AlreadyInitialized,
    NotInitialized,
    InvalidPosition,
    CannotAssignWorker,
    StructureHasNoWorkers
}

#[error_code]
pub enum UnitError {
    AlreadyInitialized,
    NotInitialized,
}

#[error_code]
pub enum SeasonError {
    AlreadyInitialized,
    NotInitialized,
    SeasonClosed,
}
