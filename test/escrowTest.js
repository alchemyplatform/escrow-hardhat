const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ProjectEscrow", function () {
  let contract;
  let client;
  let freelancer1;
  let arbiter;

  const projectPrice = ethers.utils.parseEther("1");
  const sendPrice = ethers.utils.parseEther("1.1");

  this.beforeAll(async () => {
    client = ethers.provider.getSigner(0);
    freelancer1 = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);
    const Escrow = await ethers.getContractFactory("ProjectEscrowContract");
    contract = await Escrow.deploy();
    await contract.deployed();
  });

  it("should create a project", async function () {
    await contract.connect(client).createProject(1, 1, projectPrice);
    const project = await contract.connect(client).getProject(1);
    //console.log(project);
    expect(project.client).to.eq(await client.getAddress());
  });

  it("should Assign the project to freelancer", async function () {
    await contract
      .connect(client)
      .projectAssigned(1, await freelancer1.getAddress(), {
        value: sendPrice,
      });
    const project = await contract.connect(client).getProject(1);
    expect(project.freelancer).to.eq(await freelancer1.getAddress());
    const balance = await ethers.provider.getBalance(contract.address);
    expect(sendPrice).to.eq(balance);
  });

  it("Should be able to complete the project", async function () {
    await contract.connect(client).projectCompleted(1);
    const project = await contract.connect(client).getProject(1);
    expect(project.status).to.eq(2);
    // const balance = await ethers.provider.getBalance(
    //   await freelancer1.getAddress()
    // );
    // console.log(balance);
    //expect(sendPrice).to.eq(balance);
  });

  // describe("Assignment", () => {
  //   it('should revert', async () => {
  //     await expect(contract.connect(beneficiary).approve()).to.be.reverted;
  //   });
  // });

  // describe('after approval from the arbiter', () => {
  //   it('should transfer balance to beneficiary', async () => {
  //     const before = await ethers.provider.getBalance(beneficiary.getAddress());
  //     const approveTxn = await contract.connect(arbiter).approve();
  //     await approveTxn.wait();
  //     const after = await ethers.provider.getBalance(beneficiary.getAddress());
  //     expect(after.sub(before)).to.eq(deposit);
  //   });
  // });
});
