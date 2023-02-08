import { ethers, Signer } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fund");
const getbalance = document.getElementById("balanceButton");
const withdrawBtn = document.getElementById("withdrawButton");
withdrawBtn.onclick = withdraw;
getbalance.onclick = getBalance;
connectButton.onclick = connect;
fundButton.onclick = fund;

console.log(ethers);

async function connect() {
    if (typeof window.ethereum != "undefined") {
        console.log("Let's make the world move towards Blockchain Singularity.")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected!")
        document.getElementById("connectButton").innerHTML = "Wallet Connected!"
    } else {
        console.log("No metamask!")
        document.getElementById("alert").innerHTML = "Install Metamask To Connect!"
        alert("Wallet Not Found! Ahiyo")
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.etherum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            // wait for transaction 
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done!");
        } catch (error) {
            console.log(error);
        }
        
        // Add a local network in your metamask after the issue resolves
        // connect a local account with that network
        // and then refresh the Dapp and click Fund to carry out the transaction
        
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    // return new Promise
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmation} confirmations.`)
        });
        resolve();
    });
    
    //
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance();
        console.log(ethers.utils.formatEther(balance));
        document.getElementById("balance").innerHTML = ethers.utils.formatEther(balance);
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const withdrawalResponse = await contract.withdraw();
            // wait for transaction 
            await listenForTransactionMine(withdrawalResponse, provider);
            console.log("Done!");
        } catch (error) {
            console.log(error);
        }
    }
}