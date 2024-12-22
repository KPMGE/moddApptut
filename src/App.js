import './App.css';
import { ethers } from 'ethers'
import { useState } from 'react';
import TokenArtifact from "./artifacts/contracts/KevinToken.sol/KevinToken.json"
const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

const localBlockchainAddress = 'http://localhost:8545'

function App() {
    const [tokenData, setTokenData] = useState({})
    const [amount, setAmount] = useState()

    const provider = new ethers.providers.JsonRpcProvider(localBlockchainAddress)
    const signer = provider.getSigner();

    async function _intializeContract(init) {
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

    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const contract = await _intializeContract(signer)
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const balance = await contract.balanceOf(account);
            console.log("Account Balance: ", balance.toString());
        }
    }

    async function issueToken() {
        const contract = await _intializeContract(signer)
        await contract.functions.issueToken(amount)
        console.log('Issue token successfull')
    }

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={issueToken}>issueToken</button>
                <br />
                <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
                <br />
                <button onClick={_getTokenData}>get token data</button>
                <br />
                <button onClick={getBalance}>Get Balance</button>
                <br />
                <h1>{tokenData.name}</h1>
                <h1>{tokenData.symbol}</h1>
            </header>
        </div>
    );
}

export default App;
