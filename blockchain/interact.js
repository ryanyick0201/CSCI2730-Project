const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// Read the contract address from the file system
const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
const deployedAddress = fs.readFileSync(deployedAddressPath, 'utf8');

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Create a new contract object using the ABI and bytecode
const abi = require('./MyContractAbi.json');
const InsuranceContract = new web3.eth.Contract(abi, deployedAddress);
InsuranceContract.handleRevert = true;

async function interact() {
	const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[0];

	try {
		// Create the transaction object
		const txObject = InsuranceContract.methods.injectMoney();
	
    	// Estimate gas
	    const gas = await txObject.estimateGas({ from: defaultAccount, value: '1000000000000000000' });
    	console.log('Estimated gas:', gas);

		// Send the transaction
		const tx = await txObject.send({ from: defaultAccount, gas, value: '1000000000000000000' });
		
		console.log('Transaction hash:', tx.transactionHash);

		// Get the contract balance after the transaction
		const finalBalance = await web3.eth.getBalance(InsuranceContract.options.address);
		console.log('Final Contract Balance:', web3.utils.fromWei(finalBalance, 'ether'), 'ETH');
		
	  } catch (error) {
		console.error(error);
	  }
	}


	
interact();