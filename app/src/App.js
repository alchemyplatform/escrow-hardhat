import { ethers } from "ethers";
import { useEffect, useState } from "react";

import abi from "./artifacts/contracts/ProjectEscrow.sol/ProjectEscrowContract.json";
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function getBalance() {
  const balance = await provider.getBalance(
    "0xd29e69dd20e0266569a7ff9415c33efde2cb47d1"
  );
  alert(ethers.utils.formatEther(balance));
}

function App() {
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [projectDetail, setProjectDetail] = useState(null);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const projectId = document.getElementById("projectId").value;
    const projectType = document.getElementById("projectType").value;
    const value = document.getElementById("eth").value;

    const projectEscrowContract = new ethers.Contract(
      "0xd29e69dd20e0266569a7ff9415c33efde2cb47d1",
      abi,
      signer
    );

    //console.log(value, ethers.utils.parseEther(value).toString());

    console.log("Ether", ethers.utils.parseEther(value).toString());

    const projectCreated = await projectEscrowContract.createProject(
      projectId,
      projectType,
      ethers.utils.parseEther(value).toString()
    );
    console.log("projectCreated", projectCreated);
  }

  async function assignProject() {
    const projectId = document.getElementById("projectIdAssinged").value;
    await getProjectDetails(projectId);
    const freelancer = document.getElementById("freelancer").value;

    const projectEscrowContract = new ethers.Contract(
      "0xd29e69dd20e0266569a7ff9415c33efde2cb47d1",
      abi.abi,
      signer
    );

    const projectAssigned = await projectEscrowContract.projectAssigned(
      projectId,
      freelancer,
      {
        value: ethers.BigNumber.from(projectDetail.amount),
      }
    );
    console.log("projectAssigned: ", projectAssigned);
  }

  async function markprojectDone() {
    const projectId = document.getElementById("projectIdMarkedDone").value;
    const projectEscrowContract = new ethers.Contract(
      "0xd29e69dd20e0266569a7ff9415c33efde2cb47d1",
      abi.abi,
      signer
    );

    const projectCompleted = await projectEscrowContract.projectCompleted(
      projectId
    );
    console.log("projectCompleted: ", projectCompleted);
  }

  async function getProjectDetails() {
    const projectEscrowContract = new ethers.Contract(
      "0xd29e69dd20e0266569a7ff9415c33efde2cb47d1",
      abi.abi,
      signer
    );
    const projectId = document.getElementById("projectIdForDetail").value;
    const project = await projectEscrowContract.getProject(projectId);
    setProjectDetail(project);
  }

  return (
    <>
      <div className="container">
        <div className="contract">
          <h1> New Project </h1>
          <label>
            Project Id
            <input type="text" id="projectId" />
          </label>

          <label>
            Project Type
            <input type="text" id="projectType" />
          </label>

          <label>
            Deposit Amount (in eth)
            <input type="text" id="eth" />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
          >
            Create Project
          </div>

          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              getBalance();
            }}
          >
            Get Balance
          </div>

          <h1> Assign project </h1>
          <label>
            Project Id
            <input type="text" id="projectIdAssinged" />
          </label>
          <label>
            Freelancer Address
            <input type="text" id="freelancer" />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              assignProject();
            }}
          >
            Assign Project
          </div>

          <h1> Mark the Project Done:</h1>
          <label>
            Project Id
            <input type="text" id="projectIdMarkedDone" />
          </label>
          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              markprojectDone();
            }}
          >
            Mark project Done
          </div>
          <div className="existing-contracts">
            <h1> Project Details </h1>
            <label>
              Project Id
              <input type="text" id="projectIdForDetail" />
            </label>
            <div
              className="button"
              id="deploy"
              onClick={(e) => {
                e.preventDefault();

                getProjectDetails();
              }}
            >
              Get Project Details
            </div>
            {projectDetail &&
            projectDetail.client !==
              "0x0000000000000000000000000000000000000000" ? (
              <div>
                <h1> Project Details </h1>
                <span>Client address: {projectDetail.client}</span>
                <br />
                <span>
                  Freelancer address:{" "}
                  {projectDetail.freelancer ===
                  "0x0000000000000000000000000000000000000000"
                    ? "Not Assigned"
                    : projectDetail.freelancer}
                </span>
                <br />
                <span>
                  Project Type:{" "}
                  {projectDetail.projectType === 1 ? "Fixed" : "Hourly"}
                </span>
                <br />
                <span>
                  Project Status:{" "}
                  {projectDetail.status === 0
                    ? "Created"
                    : projectDetail.status === 1
                    ? "In Progress"
                    : "Completed"}
                </span>
                <br />
                <span>
                  Project Amount:{" "}
                  {ethers.utils.formatEther(projectDetail.amount)}
                </span>
              </div>
            ) : (
              <span>No Data</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
