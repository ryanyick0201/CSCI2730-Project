import { useEffect, useState } from 'react'
import { Web3 } from 'web3'
import contractAbi from './MyContractAbi.json'
const contractAddress = '0xC8858B58f2f5D4C21d0F3E92f921dD3B96d74Da9';
export default () => {
    const [address, setAddress] = useState(localStorage.getItem('address') || '')
    const [web3, setWeb3] = useState(null)
    const [contract, setContract] = useState(null)
    useEffect(() => {
        const initWeb3 = async() => {
            if (window.ethereum) {
                // Modern dapp browsers
                const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
                try {
                    // Request account access if needed
                    await window.ethereum.enable()
                    setWeb3(web3)
                    const contract = new web3.eth.Contract(contractAbi, contractAddress);
                    const accounts = await web3.eth.getAccounts();
                    console.log(accounts)
                    console.log(contract)
                    setContract(contract)
                } catch (error) {
                    console.log(error)
                    // User denied account access
                    console.error('User denied account access')
                }
            } else if (window.web3) {
                // Legacy dapp browsers
                const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
                setWeb3(web3)
                const contract = new web3.eth.Contract(contractAbi, contractAddress);
                setContract(contract)
            } else {
                // Non-dapp browsers
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
            }
        }

        initWeb3()
    }, [])

    return {
        address,
        setAddress,
        web3,
        contract
    }
}
