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
            wood: 0,
            stone: 0,
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
})
