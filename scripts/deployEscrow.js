// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config();

async function main() {

  const expireTime = Math.round(30)
  const arbiter = "0x676543E72F887d74743f4A8686B43DBF73206d84"
  const beneficiary = "0x2A1728a97939dD7AA6391655184Bf378e43C5C9c"
  const depositAmount = hre.ethers.utils.parseEther("0.003")
  

  const escrowContract = await hre.ethers.getContractFactory("Escrow");
  const escrow = await escrowContract.deploy(arbiter, beneficiary, expireTime, {value: depositAmount} );

  await escrow.deployed();
  
  console.log(`Deployed Escrow contract to ${escrow.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
