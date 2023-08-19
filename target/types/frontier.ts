export type Frontier = {
  "version": "0.1.0",
  "name": "frontier",
  "instructions": [
    {
      "name": "initSeason",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "seasonAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initPlayerAccounts",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "armyAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buildStructure",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "structureAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "structureCount",
          "type": "u32"
        },
        {
          "name": "structureType",
          "type": {
            "defined": "StructureType"
          }
        },
        {
          "name": "position",
          "type": {
            "defined": "Position"
          }
        }
      ]
    },
    {
      "name": "collectResources",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "structureAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "structureCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "moveStructure",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "structureAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "structureCount",
          "type": "u32"
        },
        {
          "name": "newPos",
          "type": {
            "defined": "Position"
          }
        }
      ]
    },
    {
      "name": "assignWorker",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromStructureAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toStructureAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromStructureCount",
          "type": "u32"
        },
        {
          "name": "toStructureCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "trainUnit",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "armyAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "unitAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unitCount",
          "type": "u32"
        },
        {
          "name": "unitType",
          "type": {
            "defined": "UnitType"
          }
        }
      ]
    },
    {
      "name": "startMatch",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingPvpStructure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchDefendingBase",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchAttackingArmy",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "pvpStructureId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "addStructureToMatch",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "structureToAdd",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "matchDefendingBase",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchStructureAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "addedStructureId",
          "type": "u32"
        },
        {
          "name": "matchStructureId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "endMatch",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingPvpStructure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "pvpStructureId",
          "type": "u32"
        },
        {
          "name": "matchState",
          "type": {
            "defined": "MatchState"
          }
        }
      ]
    },
    {
      "name": "attackStructure",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingUnit",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingStructure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "unitId",
          "type": "u32"
        },
        {
          "name": "structureId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "attackUnit",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingUnit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingStructure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "unitId",
          "type": "u32"
        },
        {
          "name": "structureId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "army",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerAccount",
            "type": "publicKey"
          },
          {
            "name": "armySize",
            "type": "u32"
          },
          {
            "name": "armyMaxSize",
            "type": "u32"
          },
          {
            "name": "rating",
            "type": "u32"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "gameMatch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": "MatchState"
            }
          },
          {
            "name": "attackingArmy",
            "type": "publicKey"
          },
          {
            "name": "defendingBase",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "playerBase",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerAccount",
            "type": "publicKey"
          },
          {
            "name": "structureCount",
            "type": "u32"
          },
          {
            "name": "baseSize",
            "type": "u32"
          },
          {
            "name": "maxBaseSize",
            "type": "u32"
          },
          {
            "name": "maxWorkers",
            "type": "u32"
          },
          {
            "name": "rating",
            "type": "u16"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ownerPubkey",
            "type": "publicKey"
          },
          {
            "name": "rank",
            "type": "u8"
          },
          {
            "name": "experience",
            "type": "u32"
          },
          {
            "name": "resources",
            "type": {
              "defined": "Resources"
            }
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "season",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seasonId",
            "type": "u32"
          },
          {
            "name": "seasonInitializer",
            "type": "publicKey"
          },
          {
            "name": "matchCount",
            "type": "u32"
          },
          {
            "name": "playerCount",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": "SeasonState"
            }
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "structure",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "playerBase",
            "type": "publicKey"
          },
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "structureType",
            "type": {
              "defined": "StructureType"
            }
          },
          {
            "name": "stats",
            "type": {
              "defined": "StructureStats"
            }
          },
          {
            "name": "position",
            "type": {
              "defined": "Position"
            }
          },
          {
            "name": "isDestroyed",
            "type": "bool"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "unit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "army",
            "type": "publicKey"
          },
          {
            "name": "unitType",
            "type": {
              "defined": "UnitType"
            }
          },
          {
            "name": "stats",
            "type": {
              "defined": "UnitStats"
            }
          },
          {
            "name": "isDestroyed",
            "type": "bool"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Resources",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wood",
            "type": "u32"
          },
          {
            "name": "stone",
            "type": "u32"
          },
          {
            "name": "iron",
            "type": "u32"
          },
          {
            "name": "steel",
            "type": "u32"
          },
          {
            "name": "mana",
            "type": "u32"
          },
          {
            "name": "gold",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "StructureStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rank",
            "type": "u16"
          },
          {
            "name": "health",
            "type": "u16"
          },
          {
            "name": "attack",
            "type": "u16"
          },
          {
            "name": "defense",
            "type": "u16"
          },
          {
            "name": "speed",
            "type": "u16"
          },
          {
            "name": "range",
            "type": "u16"
          },
          {
            "name": "assignedWorkers",
            "type": "u8"
          },
          {
            "name": "collectionInterval",
            "type": "u16"
          },
          {
            "name": "lastInteractionTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "Position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "x",
            "type": "u16"
          },
          {
            "name": "y",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "UnitStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rank",
            "type": "u16"
          },
          {
            "name": "health",
            "type": "u16"
          },
          {
            "name": "attack",
            "type": "u16"
          },
          {
            "name": "defense",
            "type": "u16"
          },
          {
            "name": "speed",
            "type": "u16"
          },
          {
            "name": "range",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "BaseError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "BaseSizeExceeded"
          },
          {
            "name": "MaxRatingExceeded"
          },
          {
            "name": "NoStructures"
          }
        ]
      }
    },
    {
      "name": "ArmyError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "SizeExceeded"
          },
          {
            "name": "ArmyEmpty"
          }
        ]
      }
    },
    {
      "name": "GameMatchError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "InvalidDefenderPvpPortal"
          },
          {
            "name": "MatchAlreadyEnded"
          }
        ]
      }
    },
    {
      "name": "StructureError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "InvalidPosition"
          },
          {
            "name": "CannotAssignWorker"
          },
          {
            "name": "StructureHasNoWorkers"
          }
        ]
      }
    },
    {
      "name": "UnitError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          }
        ]
      }
    },
    {
      "name": "SeasonError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "SeasonClosed"
          }
        ]
      }
    },
    {
      "name": "MatchState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Started"
          },
          {
            "name": "InProgress"
          },
          {
            "name": "Cancelled"
          },
          {
            "name": "Completed"
          }
        ]
      }
    },
    {
      "name": "SeasonState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Closed"
          }
        ]
      }
    },
    {
      "name": "StructureType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ThroneHall"
          },
          {
            "name": "Barracks"
          },
          {
            "name": "Blacksmith"
          },
          {
            "name": "ManaWell"
          },
          {
            "name": "CarpenterHut"
          },
          {
            "name": "PvpPortal"
          },
          {
            "name": "Mine"
          },
          {
            "name": "Quarry"
          },
          {
            "name": "LumberMill"
          },
          {
            "name": "ArcherTower"
          },
          {
            "name": "MageTower"
          },
          {
            "name": "Wall"
          },
          {
            "name": "SentryCreature"
          }
        ]
      }
    },
    {
      "name": "UnitType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Soldier"
          },
          {
            "name": "Archer"
          },
          {
            "name": "Siege"
          },
          {
            "name": "Healer"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyInitialized"
    },
    {
      "code": 6001,
      "name": "NotInitialized"
    },
    {
      "code": 6002,
      "name": "NotEnoughResources"
    }
  ]
};

export const IDL: Frontier = {
  "version": "0.1.0",
  "name": "frontier",
  "instructions": [
    {
      "name": "initSeason",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "seasonAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initPlayerAccounts",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "armyAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buildStructure",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "structureAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "structureCount",
          "type": "u32"
        },
        {
          "name": "structureType",
          "type": {
            "defined": "StructureType"
          }
        },
        {
          "name": "position",
          "type": {
            "defined": "Position"
          }
        }
      ]
    },
    {
      "name": "collectResources",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "structureAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "structureCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "moveStructure",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "structureAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "structureCount",
          "type": "u32"
        },
        {
          "name": "newPos",
          "type": {
            "defined": "Position"
          }
        }
      ]
    },
    {
      "name": "assignWorker",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromStructureAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toStructureAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromStructureCount",
          "type": "u32"
        },
        {
          "name": "toStructureCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "trainUnit",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "armyAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "unitAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unitCount",
          "type": "u32"
        },
        {
          "name": "unitType",
          "type": {
            "defined": "UnitType"
          }
        }
      ]
    },
    {
      "name": "startMatch",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingPvpStructure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchDefendingBase",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchAttackingArmy",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "pvpStructureId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "addStructureToMatch",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "structureToAdd",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "matchDefendingBase",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchStructureAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "addedStructureId",
          "type": "u32"
        },
        {
          "name": "matchStructureId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "endMatch",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingPvpStructure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "pvpStructureId",
          "type": "u32"
        },
        {
          "name": "matchState",
          "type": {
            "defined": "MatchState"
          }
        }
      ]
    },
    {
      "name": "attackStructure",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingUnit",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingStructure",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "unitId",
          "type": "u32"
        },
        {
          "name": "structureId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "attackUnit",
      "accounts": [
        {
          "name": "attacker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "attackerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingArmy",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "attackingUnit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "defender",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defenderAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingBase",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "defendingStructure",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seasonAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gameMatch",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seasonId",
          "type": "u32"
        },
        {
          "name": "matchId",
          "type": "u32"
        },
        {
          "name": "unitId",
          "type": "u32"
        },
        {
          "name": "structureId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "army",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerAccount",
            "type": "publicKey"
          },
          {
            "name": "armySize",
            "type": "u32"
          },
          {
            "name": "armyMaxSize",
            "type": "u32"
          },
          {
            "name": "rating",
            "type": "u32"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "gameMatch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": "MatchState"
            }
          },
          {
            "name": "attackingArmy",
            "type": "publicKey"
          },
          {
            "name": "defendingBase",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "playerBase",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerAccount",
            "type": "publicKey"
          },
          {
            "name": "structureCount",
            "type": "u32"
          },
          {
            "name": "baseSize",
            "type": "u32"
          },
          {
            "name": "maxBaseSize",
            "type": "u32"
          },
          {
            "name": "maxWorkers",
            "type": "u32"
          },
          {
            "name": "rating",
            "type": "u16"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ownerPubkey",
            "type": "publicKey"
          },
          {
            "name": "rank",
            "type": "u8"
          },
          {
            "name": "experience",
            "type": "u32"
          },
          {
            "name": "resources",
            "type": {
              "defined": "Resources"
            }
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "season",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seasonId",
            "type": "u32"
          },
          {
            "name": "seasonInitializer",
            "type": "publicKey"
          },
          {
            "name": "matchCount",
            "type": "u32"
          },
          {
            "name": "playerCount",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": "SeasonState"
            }
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "structure",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "playerBase",
            "type": "publicKey"
          },
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "structureType",
            "type": {
              "defined": "StructureType"
            }
          },
          {
            "name": "stats",
            "type": {
              "defined": "StructureStats"
            }
          },
          {
            "name": "position",
            "type": {
              "defined": "Position"
            }
          },
          {
            "name": "isDestroyed",
            "type": "bool"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "unit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "army",
            "type": "publicKey"
          },
          {
            "name": "unitType",
            "type": {
              "defined": "UnitType"
            }
          },
          {
            "name": "stats",
            "type": {
              "defined": "UnitStats"
            }
          },
          {
            "name": "isDestroyed",
            "type": "bool"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Resources",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wood",
            "type": "u32"
          },
          {
            "name": "stone",
            "type": "u32"
          },
          {
            "name": "iron",
            "type": "u32"
          },
          {
            "name": "steel",
            "type": "u32"
          },
          {
            "name": "mana",
            "type": "u32"
          },
          {
            "name": "gold",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "StructureStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rank",
            "type": "u16"
          },
          {
            "name": "health",
            "type": "u16"
          },
          {
            "name": "attack",
            "type": "u16"
          },
          {
            "name": "defense",
            "type": "u16"
          },
          {
            "name": "speed",
            "type": "u16"
          },
          {
            "name": "range",
            "type": "u16"
          },
          {
            "name": "assignedWorkers",
            "type": "u8"
          },
          {
            "name": "collectionInterval",
            "type": "u16"
          },
          {
            "name": "lastInteractionTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "Position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "x",
            "type": "u16"
          },
          {
            "name": "y",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "UnitStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rank",
            "type": "u16"
          },
          {
            "name": "health",
            "type": "u16"
          },
          {
            "name": "attack",
            "type": "u16"
          },
          {
            "name": "defense",
            "type": "u16"
          },
          {
            "name": "speed",
            "type": "u16"
          },
          {
            "name": "range",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "BaseError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "BaseSizeExceeded"
          },
          {
            "name": "MaxRatingExceeded"
          },
          {
            "name": "NoStructures"
          }
        ]
      }
    },
    {
      "name": "ArmyError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "SizeExceeded"
          },
          {
            "name": "ArmyEmpty"
          }
        ]
      }
    },
    {
      "name": "GameMatchError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "InvalidDefenderPvpPortal"
          },
          {
            "name": "MatchAlreadyEnded"
          }
        ]
      }
    },
    {
      "name": "StructureError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "InvalidPosition"
          },
          {
            "name": "CannotAssignWorker"
          },
          {
            "name": "StructureHasNoWorkers"
          }
        ]
      }
    },
    {
      "name": "UnitError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          }
        ]
      }
    },
    {
      "name": "SeasonError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AlreadyInitialized"
          },
          {
            "name": "NotInitialized"
          },
          {
            "name": "SeasonClosed"
          }
        ]
      }
    },
    {
      "name": "MatchState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Started"
          },
          {
            "name": "InProgress"
          },
          {
            "name": "Cancelled"
          },
          {
            "name": "Completed"
          }
        ]
      }
    },
    {
      "name": "SeasonState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Closed"
          }
        ]
      }
    },
    {
      "name": "StructureType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ThroneHall"
          },
          {
            "name": "Barracks"
          },
          {
            "name": "Blacksmith"
          },
          {
            "name": "ManaWell"
          },
          {
            "name": "CarpenterHut"
          },
          {
            "name": "PvpPortal"
          },
          {
            "name": "Mine"
          },
          {
            "name": "Quarry"
          },
          {
            "name": "LumberMill"
          },
          {
            "name": "ArcherTower"
          },
          {
            "name": "MageTower"
          },
          {
            "name": "Wall"
          },
          {
            "name": "SentryCreature"
          }
        ]
      }
    },
    {
      "name": "UnitType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Soldier"
          },
          {
            "name": "Archer"
          },
          {
            "name": "Siege"
          },
          {
            "name": "Healer"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyInitialized"
    },
    {
      "code": 6001,
      "name": "NotInitialized"
    },
    {
      "code": 6002,
      "name": "NotEnoughResources"
    }
  ]
};
