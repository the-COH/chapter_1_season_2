import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { isConnected } from '../utils/CheckIfConnectedToMainnet';
export const WalletContext = React.createContext();

const { ethereum } = window;

export const getEthereumContract = (address, abi) => {
    
const CHAIN_ID = 7700;
const provider = new ethers.providers.JsonRpcProvider('https://canto.slingshot.finance', CHAIN_ID);
const contract = new ethers.Contract(address, abi, provider);

return contract;
}

export const getEthereumContractWithSigner = (address, abi) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    return contract;
}



export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ amount: ''});
    const [isConnectedToMainnet, setIsConnectedToMainnet] = useState(false);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}))
    }


    const checkIfWalletIsConnected = async () => {

    try {
        if(!ethereum) return alert("Please install metamask!");
        
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const chainID = await ethereum.request({ method: 'eth_chainId' });
        console.log(chainID)

        if(accounts.length) {
            setCurrentAccount(accounts[0]);
            
            console.log('Account: ', accounts[0])
            if(isConnected(chainID)) {
                console.log('Connected to mainnet')
                setIsConnectedToMainnet(true);

            } else {
                setIsConnectedToMainnet(false);
            }
        } else {
            console.log('No accounts found')
        }
        console.log(accounts);
    } catch (error) {
        console.log(error)

            throw new Error('No ethereum object.')
    }   
    }

    const connectWallet = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    
          setCurrentAccount(accounts[0]);
          window.location.reload();
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

      const addTokenToWallet = async () => {

        const CMOON = {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: cmoonAddress, // The address that the token is at.
              symbol: 'CMOON', // A ticker symbol or shorthand, up to 5 chars.
              decimals: 18, // The number of decimals in the token
              image: 'https://raw.githubusercontent.com/CryptoP00R/CantoMoon/main/Images/CantoMoon.png',
            },
          };

        try {
            // Add CMOON
            ethereum.request({
              method: 'wallet_watchAsset',
              params: CMOON, 
            });
          } catch (error) {
            console.log(error);
          }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <WalletContext.Provider value={{addTokenToWallet, connectWallet, currentAccount}}>
            {children}
        </WalletContext.Provider>
    );
}