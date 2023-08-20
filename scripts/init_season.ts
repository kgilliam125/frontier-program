import * as anchor from '@coral-xyz/anchor'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { Keypair, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Frontier } from '../target/types/frontier'
import fs from 'fs'
import * as IDL from '../target/idl/frontier.json'

// Make a keypair and save it to this file. Don't check into repo
// import * as jsonKeypair from '../keypair.json'

const FRONTIER_PROGRAM_ID = new PublicKey(
    '3FKoVbicsX7moGuqVPCY1qkZ4adA85tTpYVFEe9Vs2ei'
)

async function main() {
    const keypairFromFile = JSON.parse(fs.readFileSync('./keypair.json').toString()) as number[]
    const signingKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairFromFile))

    console.log(`Loaded keypair for ${signingKeypair.publicKey}`)

    const wallet = new NodeWallet(signingKeypair)
    const provider = new AnchorProvider(
        new Connection(clusterApiUrl('devnet')),
        wallet,
        {}
    )
    anchor.setProvider(provider)
    console.log('Created provider')

    //@ts-ignore - anchor doesn't have the right types?
    const program = new anchor.Program(
        IDL as anchor.Idl,
        FRONTIER_PROGRAM_ID
    ) as Program<Frontier>
    console.log('Loaded program', program.programId.toString())

    const seasonNumber = 0
    const buff = Buffer.allocUnsafe(4)
    buff.writeUInt32LE(seasonNumber, 0)
    const [seasonPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('season'), buff, signingKeypair.publicKey.toBuffer()],
        program.programId
    )

    await program.methods
        .initSeason(seasonNumber)
        .accounts({
            seasonAccount: seasonPda,
            owner: signingKeypair.publicKey,
        })
        .signers([signingKeypair])
        .rpc()
}

main()
