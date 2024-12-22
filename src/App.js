import './App.css';
import { ethers } from 'ethers'
import { useState } from 'react';
import TokenArtifact from "./artifacts/contracts/KevinToken.sol/KevinToken.json"
const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

const localBlockchainAddress = 'http://localhost:8545'

function App() {
    const [tokenData, setTokenData] = useState({})
    const [amount, setAmount] = useState()
    const [userAccountId, setUserAccountId] = useState()

    const provider = new ethers.providers.JsonRpcProvider(localBlockchainAddress)
    const signer = provider.getSigner();

    async function _intializeContract(init) {
        // We first initialize ethers by creating a provider using window.ethereum
        // When, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        const contract = new ethers.Contract(
            tokenAddress,
            TokenArtifact.abi,
            init
        );

        return contract
    }

    async function _getTokenData() {
        const contract = await _intializeContract(signer)

        const name = await contract.name();
        const symbol = await contract.symbol();
        const tokenData = { name, symbol }

        setTokenData(tokenData);
    }

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function sendMDToken() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const contract = await _intializeContract(signer)
            const transaction = await contract.transfer(userAccountId, amount);
            await transaction.wait();
            console.log(`${amount} MDToken has been sent to ${userAccountId}`);
        }
    }

    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const contract = await _intializeContract(signer)
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const balance = await contract.balanceOf(account);
            console.log("Account Balance: ", balance.toString());
        }
    }

    async function issueToken(amount) {
        const contract = await _intializeContract(signer)
        const kthAmount = 10000000000000
        await contract.functions.issueToken(kthAmount)
        console.log('Issue token successfull')
    }

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={issueToken}>issueToken</button>
                <button onClick={_getTokenData}>get token data</button>
                <h1>{tokenData.name}</h1>
                <h1>{tokenData.symbol}</h1>
                <button onClick={getBalance}>Get Balance</button>
                <button onClick={sendMDToken}>Send MDToken</button>
                <input onChange={e => setUserAccountId(e.target.value)} placeholder="Account ID" />
                <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
            </header>
        </div>
    );
}

export default App;
