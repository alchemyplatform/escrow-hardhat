import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import EscrowComponent from './Escrow';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow'

const provider = new ethers.providers.Web3Provider(window.ethereum);
const newContractUrl = "http://localhost:3005/contract/new"
const getContractsUrl = "http://localhost:3005/contract/all"

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
		console.log("Running useEffect hook on accounts arr")
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);


	useEffect(() => {
		console.log("Running useEffect hook on escrows arr")
		const controller = new AbortController()
		async function getEscrows() {
			const contractsRes = await fetch(getContractsUrl, {signal: controller.signal}) 
			const escrowsData = await contractsRes.json()
			console.log("Escrows data: " + JSON.stringify(escrowsData))
			escrowsData.contracts.forEach(escrow => {
				let escrowContract = new ethers.Contract(escrow.address, Escrow.abi, signer)
				console.log()
				const existingEscrow = {
					address: escrow.address,
					arbiter: escrow.arbiter,
					beneficiary: escrow.beneficiary,
          expireTime: escrow.expireTime,
					value: escrow.value.toString(),
					handleApprove: async () => {
						escrowContract.on('Approved', () => {
							document.getElementById(escrow.address).className =
						'complete';
							document.getElementById(escrow.address).innerText =
						"✓ It's been approved!";
						})
						await approve(escrowContract, signer);
					}
				}
				console.log("Adding escrow: " + JSON.stringify(escrow))
				setEscrows(escrows => [...escrows, existingEscrow])
			})
		}
		getEscrows()
		console.log("Completed useEffect hook on escrows arr")
		console.log("Escrows content: " + JSON.stringify(escrows))
		return () => {
			console.log("Cleaning up effect: ")
			controller.abort()
		}
	}, []);

  async function newContract() {
		console.log("newContract function called")
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const formValue = document.getElementById('eth').value;
    const value = ethers.utils.parseEther(formValue);
    const expireTime = Math.floor(document.getElementById('expireTime').value);
    const expireTimeSeconds = expireTime * 60

    const escrowContract = await deploy(signer, arbiter, beneficiary, expireTimeSeconds, value);

		const escrowObject = {
			address: escrowContract.address,
			beneficiary: beneficiary,
			arbiter: arbiter,
      expireTime: expireTime,
			value: value.toString()
		}
    try {
			const newContractResponse = await fetch(newContractUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(escrowObject)
			})
			console.log("New contract response from server: " + JSON.stringify(newContractResponse))

		} catch (err) {
			console.log("Contract not saved")
			throw Error(err)
		}

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      expireTime: expireTime,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
		console.log("newContract function finished")
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="eth" />
        </label>

        <label>
          Time to approve (in minutes)
          <input type="text" id="expireTime" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <EscrowComponent key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
