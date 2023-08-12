# frontier-program

This is a monolithic program which serves as a game server for the Frontier OPOS hackathon submission.

In future iterations, once the core game logic is established, this monolith should be decomposed into individually deployed programs.

## Contributing

1. Set up your local Solana/Anchor tools: https://www.anchor-lang.com/docs/installation
2. Once setup the full test suite can be run with `anchor test`
3. To deploy the program to a local validator...
    1. Start the local validator with `solana-test-validator`. Note the RPC address here to call within client code.
    1. Build the program `anchor build`
    1. Deploy the program locally `anchor deploy --provider.cluster localhost`
    1. You can tail the program logs by running `solana logs`

