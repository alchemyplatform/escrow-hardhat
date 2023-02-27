# Decentralized Escrow Application

This is an Escrow Dapp built with [Hardhat](https://hardhat.org/).

## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

# Contract Address deployed on Goerli
https://goerli.etherscan.io/address/0x0b5a9f9700E3Fb46ed9bdaF68b3f502f5737b88a

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Server

`cd` into the `/server` directory and run `npm install`
Next, run `node index.js`


## Hardhat Node

In your root directory, run the command `npx hardhat node`. This will start off a local blockchain to contract against. 

Connect your Metamask account to your local Hardhat node. I followed this tutorial to setup the local node instance and Metamask 
https://www.web3.university/article/how-to-build-a-react-dapp-with-hardhat-and-metamask


## Front-End

`cd` into the `/app` directory and run `npm install`

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage
Make sure you have 3 addresses: 1 beneficiary, 1 arbiter, and 1 depositor. The depositor should be the account connected to the dApp and should sign the transaction that creates the contract instance

