import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Frontier } from '../target/types/frontier'

describe('frontier', () => {
    // Configure the client to use the local cluster.
    // The "provider" in this case will be a player building a base and training units
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.Frontier as Program<Frontier>

    const seasonCreatorKeypair = anchor.web3.Keypair.generate()
    const seasonNumber = 0
    const buff = Buffer.allocUnsafe(4)
    buff.writeUInt32LE(seasonNumber, 0)
    const [seasonPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from('season'),
            buff,
            seasonCreatorKeypair.publicKey.toBuffer(),
        ],
        program.programId
    )

    // This player will defend an attack from the "provider"
    const defenderKeypair = anchor.web3.Keypair.generate()
    const [defenderPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('player'), defenderKeypair.publicKey.toBuffer()],
        program.programId
    )
    const [defenderBasePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('base'), defenderPda.toBuffer()],
        program.programId
    )
    const [defenderArmyPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('army'), defenderPda.toBuffer()],
        program.programId
    )
    const defenderFaction = { fishmen: {}}

    // This is the provider's player who will build a base, train units, and attack the defender
    const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('player'), provider.publicKey.toBuffer()],
        program.programId
    )
    const [basePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('base'), playerPda.toBuffer()],
        program.programId
    )
    const [armyPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('army'), playerPda.toBuffer()],
        program.programId
    )
    const faction = { orc: {}}

    // match where the provider attacks the defender

    const sleep = async (msToSleep: number) => {
        await new Promise((resolve) => setTimeout(resolve, msToSleep))
    }

    const getStructurePdaFromId = (id: number, basePda) => {
        const buff = Buffer.allocUnsafe(4)
        buff.writeUInt32LE(id, 0)
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
            [buff, basePda.toBuffer()],
            program.programId
        )

        return pda
    }

    const getUnitPdaFromId = (id: number, armyPda) => {
        const buff = Buffer.allocUnsafe(4)
        buff.writeUInt32LE(id, 0)
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
            [buff, armyPda.toBuffer()],
            program.programId
        )

        return pda
    }

    const getMatchArmyPda = (gameMatchPda, ownerPda) => {
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from('army'), gameMatchPda.toBuffer(), ownerPda.toBuffer()],
            program.programId
        )
        return pda
    }

    const getMatchBasePda = (gameMatchPda, ownerPda) => {
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from('base'), gameMatchPda.toBuffer(), ownerPda.toBuffer()],
            program.programId
        )
        return pda
    }

    const matchNumber = 1
    const getMatchPda = (matchNumber, seasonPda, arymPda, basePda) => {
        const matchBuff = Buffer.allocUnsafe(4)
        matchBuff.writeUInt32LE(matchNumber, 0)
        const [matchPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                matchBuff,
                seasonPda.toBuffer(),
                arymPda.toBuffer(),
                basePda.toBuffer(),
            ],
            program.programId
        )
        return matchPda
    }

    it('initializes a season', async () => {
        // Fund the account since this is the first time it has been used.
        const tx = new anchor.web3.Transaction()
        tx.add(
            anchor.web3.SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: seasonCreatorKeypair.publicKey,
                lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
            })
        )

        await provider.sendAndConfirm(tx)
        await program.methods
            .initSeason(seasonNumber)
            .accounts({
                seasonAccount: seasonPda,
                owner: seasonCreatorKeypair.publicKey,
            })
            .signers([seasonCreatorKeypair])
            .rpc()

        const seasonAccount = await program.account.season.fetch(seasonPda)
        expect(seasonAccount.seasonInitializer).toEqual(
            seasonCreatorKeypair.publicKey
        )
        expect(seasonAccount.isInitialized).toEqual(true)
        expect(seasonAccount.seasonId).toEqual(seasonNumber)
        expect(seasonAccount.matchCount).toEqual(0)
        expect(seasonAccount.playerCount).toEqual(0)
        expect(seasonAccount.state).toEqual({ open: {} })
    })

    it('initializes player accounts', async () => {
        const tx = await program.methods
            .initPlayerAccounts(faction)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                armyAccount: armyPda,
            })
            .rpc()

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.ownerPubkey).toEqual(provider.publicKey)
        expect(playerAccount.experience).toEqual(0)
        expect(playerAccount.rank).toEqual(0)
        expect(playerAccount.isInitialized).toEqual(true)
        expect(playerAccount.resources).toEqual({
            wood: 500,
            stone: 500,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })
        expect(playerAccount.faction).toEqual(faction)

        const baseAccount = await program.account.playerBase.fetch(basePda)
        expect(baseAccount.playerAccount).toEqual(playerPda)
        expect(baseAccount.isInitialized).toEqual(true)
        expect(baseAccount.rating).toEqual(0)
        expect(baseAccount.structureCount).toEqual(0)
        expect(baseAccount.baseSize).toEqual(0)

        const armyAccount = await program.account.army.fetch(armyPda)
        expect(armyAccount.playerAccount).toEqual(playerPda)
        expect(armyAccount.isInitialized).toEqual(true)
        expect(armyAccount.rating).toEqual(0)
        expect(armyAccount.armySize).toEqual(0)
        expect(armyAccount.armyMaxSize).toEqual(10)
        expect(armyAccount.faction).toEqual(faction)
    })

    it('builds a throne hall', async () => {
        let baseAccount = await program.account.playerBase.fetch(basePda)
        const nextStructureCount = baseAccount.structureCount + 1
        const structureType = { throneHall: {} }

        const structureCountAsBuff = Buffer.allocUnsafe(4)
        structureCountAsBuff.writeUInt32LE(nextStructureCount, 0)
        const [structurePda] = anchor.web3.PublicKey.findProgramAddressSync(
            [structureCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        await program.methods
            .buildStructure(nextStructureCount, structureType, { x: 0, y: 0 })
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: structurePda,
            })
            .rpc()

        baseAccount = await program.account.playerBase.fetch(basePda)
        expect(baseAccount.structureCount).toEqual(nextStructureCount)
        expect(baseAccount.rating).toEqual(1)
        expect(baseAccount.maxWorkers).toEqual(5)

        const playerAccount = await program.account.player.fetch(playerPda)
        // First throne hall is free
        expect(playerAccount.resources).toEqual({
            wood: 500,
            stone: 500,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })

        const structureAccount = await program.account.structure.fetch(
            structurePda
        )
        expect(structureAccount.id).toEqual(nextStructureCount)
        expect(structureAccount.player).toEqual(playerPda)
        expect(structureAccount.playerBase).toEqual(basePda)
        expect(structureAccount.isInitialized).toEqual(true)
        expect(structureAccount.structureType).toEqual(structureType)
        expect(structureAccount.position).toEqual({ x: 0, y: 0 })
    })

    it('builds a quarry', async () => {
        let baseAccount = await program.account.playerBase.fetch(basePda)
        const nextStructureCount = baseAccount.structureCount + 1
        const structureType = { quarry: {} }

        const structureCountAsBuff = Buffer.allocUnsafe(4)
        structureCountAsBuff.writeUInt32LE(nextStructureCount, 0)
        const [structurePda] = anchor.web3.PublicKey.findProgramAddressSync(
            [structureCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        await program.methods
            .buildStructure(nextStructureCount, structureType, { x: 0, y: 0 })
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: structurePda,
            })
            .rpc()

        baseAccount = await program.account.playerBase.fetch(basePda)
        expect(baseAccount.structureCount).toEqual(nextStructureCount)

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 400,
            stone: 400,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })

        const structureAccount = await program.account.structure.fetch(
            structurePda
        )
        expect(structureAccount.id).toEqual(nextStructureCount)
        expect(structureAccount.player).toEqual(playerPda)
        expect(structureAccount.playerBase).toEqual(basePda)
        expect(structureAccount.isInitialized).toEqual(true)
        expect(structureAccount.structureType).toEqual(structureType)
        expect(structureAccount.position).toEqual({ x: 0, y: 0 })
    })

    it('builds a lumber mill', async () => {
        let baseAccount = await program.account.playerBase.fetch(basePda)
        const nextStructureCount = baseAccount.structureCount + 1
        const structureType = { lumberMill: {} }

        const structureCountAsBuff = Buffer.allocUnsafe(4)
        structureCountAsBuff.writeUInt32LE(nextStructureCount, 0)
        const [structurePda] = anchor.web3.PublicKey.findProgramAddressSync(
            [structureCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        await program.methods
            .buildStructure(nextStructureCount, structureType, { x: 0, y: 0 })
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: structurePda,
            })
            .rpc()

        baseAccount = await program.account.playerBase.fetch(basePda)
        expect(baseAccount.structureCount).toEqual(nextStructureCount)

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 300,
            stone: 300,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })

        const structureAccount = await program.account.structure.fetch(
            structurePda
        )
        expect(structureAccount.id).toEqual(nextStructureCount)
        expect(structureAccount.player).toEqual(playerPda)
        expect(structureAccount.playerBase).toEqual(basePda)
        expect(structureAccount.isInitialized).toEqual(true)
        expect(structureAccount.structureType).toEqual(structureType)
        expect(structureAccount.position).toEqual({ x: 0, y: 0 })
    })

    it('builds a mine', async () => {
        let baseAccount = await program.account.playerBase.fetch(basePda)
        const nextStructureCount = baseAccount.structureCount + 1
        const structureType = { mine: {} }

        const structureCountAsBuff = Buffer.allocUnsafe(4)
        structureCountAsBuff.writeUInt32LE(nextStructureCount, 0)
        const [structurePda] = anchor.web3.PublicKey.findProgramAddressSync(
            [structureCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        await program.methods
            .buildStructure(nextStructureCount, structureType, { x: 0, y: 0 })
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: structurePda,
            })
            .rpc()

        baseAccount = await program.account.playerBase.fetch(basePda)
        expect(baseAccount.structureCount).toEqual(nextStructureCount)

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 250,
            stone: 50,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })

        const structureAccount = await program.account.structure.fetch(
            structurePda
        )
        expect(structureAccount.id).toEqual(nextStructureCount)
        expect(structureAccount.player).toEqual(playerPda)
        expect(structureAccount.playerBase).toEqual(basePda)
        expect(structureAccount.isInitialized).toEqual(true)
        expect(structureAccount.structureType).toEqual(structureType)
        expect(structureAccount.position).toEqual({ x: 0, y: 0 })
    })

    it('does not collect resources if no worker assigned', async () => {
        await sleep(4000) // resource timer is 60 seconds
        const quarryId = 2 // quarry id
        const quarryCountAsBuff = Buffer.allocUnsafe(4)
        quarryCountAsBuff.writeUInt32LE(quarryId, 0)
        const [quarryPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [quarryCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const lumberMillId = 3 // lumberMill id
        const lumberMillCountAsBuff = Buffer.allocUnsafe(4)
        lumberMillCountAsBuff.writeUInt32LE(lumberMillId, 0)
        const [lumberMillPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [lumberMillCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const quaryIx = await program.methods
            .collectResources(quarryId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: quarryPda,
            })
            .transaction()
        const lumberMillIx = await program.methods
            .collectResources(lumberMillId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: lumberMillPda,
            })
            .transaction()

        const transaction = new anchor.web3.Transaction()
        transaction.add(quaryIx)
        transaction.add(lumberMillIx)

        // try {
        await program.provider.sendAndConfirm(transaction)

        // expect(true).toBe(false)
        // } catch (err) {
        // expect(err.toString()).toContain('0x1775')
        // }

        // Should it error if no worker?
        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 250,
            stone: 50,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })
    })

    it('assigns workers to structures', async () => {
        const throneHallId = 1 // quarry id
        const throneHallCountAsBuff = Buffer.allocUnsafe(4)
        throneHallCountAsBuff.writeUInt32LE(throneHallId, 0)
        const [throneHallPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [throneHallCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const quarryId = 2 // quarry id
        const quarryCountAsBuff = Buffer.allocUnsafe(4)
        quarryCountAsBuff.writeUInt32LE(quarryId, 0)
        const [quarryPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [quarryCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const lumberMillId = 3 // lumberMill id
        const lumberMillCountAsBuff = Buffer.allocUnsafe(4)
        lumberMillCountAsBuff.writeUInt32LE(lumberMillId, 0)
        const [lumberMillPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [lumberMillCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const mineId = 4
        const minePda = getStructurePdaFromId(mineId, basePda)

        const quaryIx = await program.methods
            .assignWorker(throneHallId, quarryId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                fromStructureAccount: throneHallPda,
                toStructureAccount: quarryPda,
            })
            .transaction()
        const lumberMillIx = await program.methods
            .assignWorker(throneHallId, lumberMillId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                fromStructureAccount: throneHallPda,
                toStructureAccount: lumberMillPda,
            })
            .transaction()
        const mineIx = await program.methods
            .assignWorker(throneHallId, mineId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                fromStructureAccount: throneHallPda,
                toStructureAccount: minePda,
            })
            .transaction()

        const transaction = new anchor.web3.Transaction()
        transaction.add(quaryIx)
        transaction.add(lumberMillIx)
        transaction.add(mineIx)
        await program.provider.sendAndConfirm(transaction)

        const throneHallAccount = await program.account.structure.fetch(
            throneHallPda
        )
        expect(throneHallAccount.stats.assignedWorkers).toBe(2)

        const quarryAccount = await program.account.structure.fetch(quarryPda)
        expect(quarryAccount.stats.assignedWorkers).toBe(1)

        const lumberMillAccount = await program.account.structure.fetch(
            lumberMillPda
        )
        expect(lumberMillAccount.stats.assignedWorkers).toBe(1)

        const mineAccount = await program.account.structure.fetch(minePda)
        expect(mineAccount.stats.assignedWorkers).toBe(1)
    })

    it('collects resources from structures', async () => {
        const quarryId = 2 // quarry id
        const quarryCountAsBuff = Buffer.allocUnsafe(4)
        quarryCountAsBuff.writeUInt32LE(quarryId, 0)
        const [quarryPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [quarryCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const lumberMillId = 3 // lumberMill id
        const lumberMillCountAsBuff = Buffer.allocUnsafe(4)
        lumberMillCountAsBuff.writeUInt32LE(lumberMillId, 0)
        const [lumberMillPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [lumberMillCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const mineId = 4
        const minePda = getStructurePdaFromId(mineId, basePda)

        const quaryIx = await program.methods
            .collectResources(quarryId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: quarryPda,
            })
            .transaction()
        const lumberMillIx = await program.methods
            .collectResources(lumberMillId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: lumberMillPda,
            })
            .transaction()
        const mineIx = await program.methods
            .collectResources(mineId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: minePda,
            })
            .transaction()

        const transaction = new anchor.web3.Transaction()
        transaction.add(quaryIx)
        transaction.add(lumberMillIx)
        transaction.add(mineIx)
        await program.provider.sendAndConfirm(transaction)

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 500,
            stone: 300,
            iron: 250,
            steel: 250,
            mana: 0,
            gold: 250,
        })
    })

    it('does not collect resources from structures if timer not elapsed', async () => {
        const quarryId = 2 // quarry id
        const quarryCountAsBuff = Buffer.allocUnsafe(4)
        quarryCountAsBuff.writeUInt32LE(quarryId, 0)
        const [quarryPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [quarryCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const lumberMillId = 3 // lumberMill id
        const lumberMillCountAsBuff = Buffer.allocUnsafe(4)
        lumberMillCountAsBuff.writeUInt32LE(lumberMillId, 0)
        const [lumberMillPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [lumberMillCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const quaryIx = await program.methods
            .collectResources(quarryId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: quarryPda,
            })
            .transaction()
        const lumberMillIx = await program.methods
            .collectResources(lumberMillId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: lumberMillPda,
            })
            .transaction()

        const transaction = new anchor.web3.Transaction()
        transaction.add(quaryIx)
        transaction.add(lumberMillIx)

        // try {
        await program.provider.sendAndConfirm(transaction)
        // expect(true).toBe(false)
        // } catch (err) {
        // expect(err.toString()).toContain('0x1773')
        // }

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 500,
            stone: 300,
            iron: 250,
            steel: 250,
            mana: 0,
            gold: 250,
        })
    })

    it('moves a structure', async () => {
        const throneHallId = 1 // quarry id
        const throneHallCountAsBuff = Buffer.allocUnsafe(4)
        throneHallCountAsBuff.writeUInt32LE(throneHallId, 0)
        const [throneHallPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [throneHallCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        await program.methods
            .moveStructure(throneHallId, { x: 10, y: 10 })
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: throneHallPda,
            })
            .rpc()

        const structureAccount = await program.account.structure.fetch(
            throneHallPda
        )
        expect(structureAccount.id).toEqual(throneHallId)
        expect(structureAccount.player).toEqual(playerPda)
        expect(structureAccount.playerBase).toEqual(basePda)
        expect(structureAccount.isInitialized).toEqual(true)
        expect(structureAccount.structureType).toEqual({ throneHall: {} })
        expect(structureAccount.position).toEqual({ x: 10, y: 10 })
    })

    it('trains a unit', async () => {
        let armyAccount = await program.account.army.fetch(armyPda)
        const nextUnitCount = armyAccount.armySize + 1
        const unitType = { soldier: {} }

        // todo just make a damn helper function for this already
        const unitCountAsBuff = Buffer.allocUnsafe(4)
        unitCountAsBuff.writeUInt32LE(nextUnitCount, 0)
        const [unitPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [unitCountAsBuff, armyPda.toBuffer()],
            program.programId
        )

        await program.methods
            .trainUnit(nextUnitCount, unitType)
            .accounts({
                playerAccount: playerPda,
                armyAccount: armyPda,
                unitAccount: unitPda,
            })
            .rpc()

        armyAccount = await program.account.army.fetch(armyPda)
        expect(armyAccount.armySize).toEqual(nextUnitCount)

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 500,
            stone: 300,
            iron: 150,
            steel: 250,
            mana: 0,
            gold: 150,
        })

        const unitAccount = await program.account.unit.fetch(unitPda)
        expect(unitAccount.id).toEqual(nextUnitCount)
        expect(unitAccount.player).toEqual(playerPda)
        expect(unitAccount.army).toEqual(armyPda)
        expect(unitAccount.isInitialized).toEqual(true)
        expect(unitAccount.unitType).toEqual(unitType)
    })

    // todo test can't start match w/o pvp portal in defending base
    it('starts a match', async () => {
        // Fund the account since this is the first time it has been used.
        let tx = new anchor.web3.Transaction()
        tx.add(
            anchor.web3.SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: defenderKeypair.publicKey,
                lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
            })
        )
        await provider.sendAndConfirm(tx)

        // Create defenders base and build a pvp portal so they can be attacked
        await program.methods
            .initPlayerAccounts(defenderFaction)
            .accounts({
                owner: defenderKeypair.publicKey,
                playerAccount: defenderPda,
                baseAccount: defenderBasePda,
                armyAccount: defenderArmyPda,
            })
            .signers([defenderKeypair])
            .rpc()

        const defenderBaseAccout = await program.account.playerBase.fetch(
            defenderBasePda
        )
        const nextStructureCount = defenderBaseAccout.structureCount + 1
        const structureType = { pvpPortal: {} }
        const defenderPvpPortal = getStructurePdaFromId(
            nextStructureCount,
            defenderBasePda
        )
        await program.methods
            .buildStructure(nextStructureCount, structureType, { x: 0, y: 0 })
            .accounts({
                owner: defenderKeypair.publicKey,
                playerAccount: defenderPda,
                baseAccount: defenderBasePda,
                structureAccount: defenderPvpPortal,
            })
            .signers([defenderKeypair])
            .rpc()

        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const matchArmyPda = getMatchArmyPda(matchPda, playerPda)
        const matchBasePda = getMatchBasePda(matchPda, defenderPda)

        // Now finally create the match. provider is the signer
        await program.methods
            .startMatch(seasonNumber, matchNumber, nextStructureCount)
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                defendingPvpStructure: defenderPvpPortal,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
                matchDefendingBase: matchBasePda,
                matchAttackingArmy: matchArmyPda,
            })
            .rpc()

        const seasonAccount = await program.account.season.fetch(seasonPda)
        expect(seasonAccount.matchCount).toEqual(matchNumber)

        const matchAccount = await program.account.gameMatch.fetch(matchPda)
        expect(matchAccount.id).toEqual(matchNumber)
        expect(matchAccount.isInitialized).toEqual(true)
        expect(matchAccount.defendingBase).toEqual(matchBasePda)
        expect(matchAccount.attackingArmy).toEqual(matchArmyPda)
        expect(matchAccount.state).toEqual({ populating: {} })

        const baseAccount = await program.account.playerBase.fetch(matchBasePda)
        expect(baseAccount.playerAccount).toEqual(matchPda)
        expect(baseAccount.isInitialized).toEqual(true)
        expect(baseAccount.rating).toEqual(0)
        expect(baseAccount.structureCount).toEqual(0)
        expect(baseAccount.baseSize).toEqual(0)
        expect(baseAccount.faction).toEqual(defenderFaction)

        const armyAccount = await program.account.army.fetch(matchArmyPda)
        expect(armyAccount.playerAccount).toEqual(matchPda)
        expect(armyAccount.isInitialized).toEqual(true)
        expect(armyAccount.rating).toEqual(0)
        expect(armyAccount.armySize).toEqual(0)
        expect(armyAccount.armyMaxSize).toEqual(10)
        expect(armyAccount.faction).toEqual(faction)

    })

    it('adds a structure to a started match', async () => {
        // Need to build a defensive structure first since there are none at this point
        let defenderBaseAccount = await program.account.playerBase.fetch(
            defenderBasePda
        )
        const archerTowerId = defenderBaseAccount.structureCount + 1
        const structureType = { archerTower: {} }
        const archerTowerPda = getStructurePdaFromId(
            archerTowerId,
            defenderBasePda
        )

        await program.methods
            .buildStructure(archerTowerId, structureType, { x: 0, y: 0 })
            .accounts({
                owner: defenderKeypair.publicKey,
                playerAccount: defenderPda,
                baseAccount: defenderBasePda,
                structureAccount: archerTowerPda,
            })
            .signers([defenderKeypair])
            .rpc()

        // verify structure was built
        let structureAccount = await program.account.structure.fetch(
            archerTowerPda
        )
        expect(structureAccount.stats.health).toEqual(100)
        expect(structureAccount.isDestroyed).toEqual(false)

        const matchStructureId = 1
        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const matchBasePda = getMatchBasePda(matchPda, defenderPda)
        const matchStructurePda = getStructurePdaFromId(
            matchStructureId,
            matchBasePda
        )

        await program.methods
            .addStructureToMatch(
                seasonNumber,
                matchNumber,
                archerTowerId,
                matchStructureId
            )
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                structureToAdd: archerTowerPda,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
                matchDefendingBase: matchBasePda,
                matchStructureAccount: matchStructurePda,
            })
            .rpc()

        const matchArcherTowerAccount = await program.account.structure.fetch(
            matchStructurePda
        )
        const archerTowerAccount = await program.account.structure.fetch(
            archerTowerPda
        )
        expect(matchArcherTowerAccount.isInitialized).toEqual(true)
        expect(matchArcherTowerAccount.player).toEqual(matchPda)
        expect(matchArcherTowerAccount.stats).toEqual(archerTowerAccount.stats)
        expect(matchArcherTowerAccount.position).toEqual(
            archerTowerAccount.position
        )
        expect(matchArcherTowerAccount.structureType).toEqual(
            archerTowerAccount.structureType
        )
        expect(matchArcherTowerAccount.isDestroyed).toEqual(false)

        const matchBasePdaAccount = await program.account.playerBase.fetch(
            matchBasePda
        )
        expect(matchBasePdaAccount.structureCount).toEqual(1)

        const matchAccount = await program.account.gameMatch.fetch(matchPda)
        expect(matchAccount.activeStructures).toEqual(1)
    })

    it('adds a unit to a started match', async () => {
        // todo I just happen to know these because of the order of prior tests. Should make available globally
        const attackerUnitId = 1
        const matchUnitId = 1
        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const matchArmyPda = getMatchArmyPda(matchPda, playerPda)
        const matchUnitPda = getUnitPdaFromId(matchUnitId, matchArmyPda)
        const unitPda = getUnitPdaFromId(attackerUnitId, armyPda)

        await program.methods
            .addUnitToMatch(
                seasonNumber,
                matchNumber,
                attackerUnitId,
                matchUnitId
            )
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                unitToAdd: unitPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
                matchAttackingArmy: matchArmyPda,
                matchUnitAccount: matchUnitPda,
            })
            .rpc()

        const matchUnitAccount = await program.account.unit.fetch(matchUnitPda)
        const unitAccount = await program.account.unit.fetch(unitPda)
        expect(matchUnitAccount.isInitialized).toEqual(true)
        expect(matchUnitAccount.player).toEqual(matchPda)
        expect(matchUnitAccount.stats).toEqual(unitAccount.stats)
        // expect(matchUnitAccount.stats).toEqual(unitAccount.position)
        expect(matchUnitAccount.unitType).toEqual(unitAccount.unitType)
        expect(matchUnitAccount.isDestroyed).toEqual(false)

        const matchArmyPdaAccount = await program.account.army.fetch(
            matchArmyPda
        )
        expect(matchArmyPdaAccount.armySize).toEqual(1)

        const matchAccount = await program.account.gameMatch.fetch(matchPda)
        expect(matchAccount.activeUnits).toEqual(1)
    })

    // todo test that you can't complete match if not in progress
    // todo test that you can cancel match, but this is annoying right now

    it('transitions match to combat phase', async () => {
        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const requestedTransitionState = { inProgress: {}}

        await program.methods
            .transitionMatchState(seasonNumber, matchNumber, requestedTransitionState)
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
            })
            .rpc()

        const matchAccount = await program.account.gameMatch.fetch(matchPda)
        expect(matchAccount.state).toEqual(requestedTransitionState)
    })

    it('unit attacks a structure', async () => {
        // todo I just happen to know these because of the order of prior tests. Should make available globally
        const matchUnitId = 1
        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const matchArmyPda = getMatchArmyPda(matchPda, playerPda)
        const matchUnitPda = getUnitPdaFromId(matchUnitId, matchArmyPda)

        const matchStructureId = 1
        const matchBasePda = getMatchBasePda(matchPda, defenderPda)
        const matchStructurePda = getStructurePdaFromId(
            matchStructureId,
            matchBasePda
        )

        await program.methods
            .attackStructure(
                seasonNumber,
                matchNumber,
                matchUnitId,
                matchStructureId
            )
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
                matchAttackingArmy: matchArmyPda,
                attackingMatchUnit: matchUnitPda,
                matchDefendingBase: matchBasePda,
                defendingMatchStructure: matchStructurePda,
            })
            .rpc()

        const matchStructureAccount = await program.account.structure.fetch(
            matchStructurePda
        )
        expect(matchStructureAccount.stats.health).toEqual(90)
        expect(matchStructureAccount.isDestroyed).toEqual(false)

        // the player's structure is unharmed
        let defenderBaseAccount = await program.account.playerBase.fetch(
            defenderBasePda
        )
        const archerTowerId = defenderBaseAccount.structureCount
        const archerTowerPda = getStructurePdaFromId(
            archerTowerId,
            defenderBasePda
        )
        const structureAccount = await program.account.structure.fetch(
            archerTowerPda
        )
        expect(structureAccount.stats.health).toEqual(100)
        expect(structureAccount.isDestroyed).toEqual(false)
    })

    it('structure attacks a unit', async () => {
        // todo I just happen to know these because of the order of prior tests. Should make available globally
        const matchUnitId = 1
        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const matchArmyPda = getMatchArmyPda(matchPda, playerPda)
        const matchUnitPda = getUnitPdaFromId(matchUnitId, matchArmyPda)

        const matchStructureId = 1
        const matchBasePda = getMatchBasePda(matchPda, defenderPda)
        const matchStructurePda = getStructurePdaFromId(
            matchStructureId,
            matchBasePda
        )

        await program.methods
            .attackUnit(
                seasonNumber,
                matchNumber,
                matchUnitId,
                matchStructureId
            )
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
                matchAttackingArmy: matchArmyPda,
                attackingMatchUnit: matchUnitPda,
                matchDefendingBase: matchBasePda,
                defendingMatchStructure: matchStructurePda,
            })
            .rpc()

        const matchUnitAccount = await program.account.unit.fetch(matchUnitPda)
        expect(matchUnitAccount.stats.health).toEqual(90)
        expect(matchUnitAccount.isDestroyed).toEqual(false)

        // the player's unit is unharmed
        const attackerUnitId = 1
        const unitPda = getUnitPdaFromId(attackerUnitId, armyPda)
        const unitAccount = await program.account.unit.fetch(unitPda)
        expect(unitAccount.stats.health).toEqual(100)
        expect(unitAccount.isDestroyed).toEqual(false)
    })

    it('destroys a structure', async () => {
        // todo I just happen to know these because of the order of prior tests. Should make available globally
        const matchUnitId = 1
        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const matchArmyPda = getMatchArmyPda(matchPda, playerPda)
        const matchUnitPda = getUnitPdaFromId(matchUnitId, matchArmyPda)

        const matchStructureId = 1
        const matchBasePda = getMatchBasePda(matchPda, defenderPda)
        const matchStructurePda = getStructurePdaFromId(
            matchStructureId,
            matchBasePda
        )

        const attackerIx = await program.methods
            .attackStructure(
                seasonNumber,
                matchNumber,
                matchUnitId,
                matchStructureId
            )
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
                matchAttackingArmy: matchArmyPda,
                attackingMatchUnit: matchUnitPda,
                matchDefendingBase: matchBasePda,
                defendingMatchStructure: matchStructurePda,
            })
            .transaction()

        const tx = new anchor.web3.Transaction()
        tx.add(attackerIx)
        tx.add(attackerIx)
        tx.add(attackerIx)
        tx.add(attackerIx)
        tx.add(attackerIx)
        tx.add(attackerIx)
        tx.add(attackerIx)
        tx.add(attackerIx)
        tx.add(attackerIx)
        await provider.sendAndConfirm(tx)

        const matchStructureAccount = await program.account.structure.fetch(
            matchStructurePda
        )
        expect(matchStructureAccount.stats.health).toEqual(0)
        expect(matchStructureAccount.isDestroyed).toEqual(true)
    })

    it('transitions match to completion', async () => {
        const matchPda = getMatchPda(
            matchNumber,
            seasonPda,
            armyPda,
            defenderBasePda
        )
        const requestedTransitionState = { completed: {}}

        await program.methods
            .transitionMatchState(seasonNumber, matchNumber, requestedTransitionState)
            .accounts({
                attacker: provider.publicKey,
                attackerAccount: playerPda,
                attackingArmy: armyPda,
                defender: defenderKeypair.publicKey,
                defenderAccount: defenderPda,
                defendingBase: defenderBasePda,
                seasonOwner: seasonCreatorKeypair.publicKey,
                seasonAccount: seasonPda,
                gameMatch: matchPda,
            })
            .rpc()

        const matchAccount = await program.account.gameMatch.fetch(matchPda)
        expect(matchAccount.state).toEqual(requestedTransitionState)
    })
})
