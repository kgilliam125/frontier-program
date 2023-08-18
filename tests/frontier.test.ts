import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Frontier } from '../target/types/frontier'

describe('frontier', () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.Frontier as Program<Frontier>

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

    const sleep = async (msToSleep: number) => {
        await new Promise((resolve) => setTimeout(resolve, msToSleep))
    }

    const getStructurePdaFromId = (id: number) => {
        const buff = Buffer.allocUnsafe(4)
        buff.writeUInt32LE(id, 0)
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
            [buff, basePda.toBuffer()],
            program.programId
        )

        return pda
    }

    const getUnitPdaFromId = (id: number) => {
        const buff = Buffer.allocUnsafe(4)
        buff.writeUInt32LE(id, 0)
        const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
            [buff, armyPda.toBuffer()],
            program.programId
        )

        return pda
    }

    it('It initializes player accounts!', async () => {
        const tx = await program.methods
            .initPlayerAccounts()
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
        const minePda = getStructurePdaFromId(mineId)

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

        const throneHallAccount = await program.account.structure.fetch(throneHallPda)
        expect(throneHallAccount.stats.assignedWorkers).toBe(2)

        const quarryAccount = await program.account.structure.fetch(quarryPda)
        expect(quarryAccount.stats.assignedWorkers).toBe(1)

        const lumberMillAccount = await program.account.structure.fetch(lumberMillPda)
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
        const minePda = getStructurePdaFromId(mineId)

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
        expect(structureAccount.structureType).toEqual({ throneHall: {}})
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

        const unitAccount = await program.account.unit.fetch(
            unitPda
        )
        expect(unitAccount.id).toEqual(nextUnitCount)
        expect(unitAccount.player).toEqual(playerPda)
        expect(unitAccount.army).toEqual(armyPda)
        expect(unitAccount.isInitialized).toEqual(true)
        expect(unitAccount.unitType).toEqual(unitType)
    })
})
