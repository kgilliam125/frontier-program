import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { ClashOfClones } from '../target/types/clash_of_clones'

describe('clash-of-clones', () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.ClashOfClones as Program<ClashOfClones>

    const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('player'), provider.publicKey.toBuffer()],
        program.programId
    )
    const [basePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('base'), provider.publicKey.toBuffer()],
        program.programId
    )

    it('It initialized a player!', async () => {
        const tx = await program.methods
            .initPlayer()
            .accounts({
                playerAccount: playerPda,
                baseAccount: basePda,
            })
            .rpc()

        const playerAccount = await program.account.player.fetch(playerPda)

        expect(playerAccount.ownerPubkey).toEqual(provider.publicKey)
    })
})
