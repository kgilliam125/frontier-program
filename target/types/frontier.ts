export type Frontier = {
  "version": "0.1.0",
  "name": "frontier",
  "instructions": [
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
            "name": "unitCount",
            "type": "u32"
          },
          {
            "name": "armySize",
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
            "name": "availableWorkers",
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
            "name": "CollectionTimerNotExpired"
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
            "name": "unitCount",
            "type": "u32"
          },
          {
            "name": "armySize",
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
            "name": "availableWorkers",
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
            "name": "CollectionTimerNotExpired"
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
