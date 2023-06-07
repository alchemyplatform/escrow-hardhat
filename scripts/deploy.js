const { artifacts, ethers } = require("hardhat");

async function main() {
  // We get the contract to deploy
  const url = process.env.GOERLI_URL;
  const privateKey = process.env.PRIVATE_KEY || "";
  const appArtifacts = await artifacts.readArtifact("ProjectEscrowContract");
  const providers = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(privateKey, providers);
  let factory = new ethers.ContractFactory(
    appArtifacts.abi,
    appArtifacts.bytecode,
    wallet
  );

  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`Faucet deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
