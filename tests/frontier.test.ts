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
        expect(armyAccount.unitCount).toEqual(0)
        expect(armyAccount.armySize).toEqual(0)
    })

    it('builds a quary', async () => {
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

    it('collects resources from structures', async () => {
        const quarryId = 1 // quarry id
        const quarryCountAsBuff = Buffer.allocUnsafe(4)
        quarryCountAsBuff.writeUInt32LE(quarryId, 0)
        const [quarryPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [quarryCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const lumberMillId = 2 // lumberMill id
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
        await program.provider.sendAndConfirm(transaction)

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 550,
            stone: 550,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })
    })

    it('does not collect resources from structures if timer not elapsed', async () => {
        const quarryId = 1 // quarry id
        const quarryCountAsBuff = Buffer.allocUnsafe(4)
        quarryCountAsBuff.writeUInt32LE(quarryId, 0)
        const [quarryPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [quarryCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        const lumberMillId = 2 // lumberMill id
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

        try {
            await program.provider.sendAndConfirm(transaction)
        } catch (err) {
            expect(err.toString()).toContain('0x1773')
        }

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 550,
            stone: 550,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })
    })
})
