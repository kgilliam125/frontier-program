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

    it('builds a structure', async () => {
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

    it('collects resources from a structure', async () => {
        let baseAccount = await program.account.playerBase.fetch(basePda)
        const structureId = baseAccount.structureCount
        const structureCountAsBuff = Buffer.allocUnsafe(4)
        structureCountAsBuff.writeUInt32LE(structureId, 0)
        const [structurePda] = anchor.web3.PublicKey.findProgramAddressSync(
            [structureCountAsBuff, basePda.toBuffer()],
            program.programId
        )

        await program.methods
            .collectResources(structureId)
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
                structureAccount: structurePda,
            })
            .rpc()

        const playerAccount = await program.account.player.fetch(playerPda)
        expect(playerAccount.resources).toEqual({
            wood: 400,
            stone: 650,
            iron: 0,
            steel: 0,
            mana: 0,
            gold: 0,
        })

    })
})
