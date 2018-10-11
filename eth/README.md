# ProvNet - ETH

This project contains the necessary Ethereum smart contracts for the ProvNet project to work.

## Setting up the dev environment

1. Run `npm install`. This will install among other dependencies the truffle suite as a local dependency. Alternatively you can install the truffle suite as a globally like described in the [truffle documentation](https://truffleframework.com/docs/truffle/getting-started/installation).
1. Navigate in to `.node_modules/ethereum-libraries-linked-list/contracts` and change the pragma in the `LinkedListLib.sol` contract from `pragma solidity 0.4.21;` to `pragma solidity ^0.4.21;`. This is necessary due to an [open issue](https://github.com/Modular-Network/ethereum-libraries/issues/92) in the deployed package.
1. Run `truffle compile` to build all the contracts.
1. Optional: To run a local chain you can execute the following commands:
    * Run `truffle develop` to start a development chain.
    * Within the truffle console run `migrate --reset`. This will compile and deploy all the contracts to the local development chain. Further more it will deploy a demo network of provenance contracts. The addresses of all demo contracts will be visible in the output of the migration.