import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress, mintPrice, disciplesLairContractAbi, disciplesLairContractAddress, CrystalAddress } from '../utils/constants';
import { isConnected } from '../utils/CheckIfConnectedToMainnet';
import { getNftOwnedByUser } from '../utils/getTokensHeldByOwner';
import { toArray } from '../utils/toArray';
import { UShardRequirement, DisciplesStakedRequirement, AetherRequirement } from '../utils/ShardMintRequirements';

export const CultNFTContext = React.createContext();

const { ethereum } = window;

export const getEthereumContract = (address, abi) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const cultNFTContract = new ethers.Contract(address, abi, signer);

    return cultNFTContract;
}




export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ amount: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [isConnectedToMainnet, setIsConnectedToMainnet] = useState(false);
    const [tokenIdsOwnedByUser, setTokenIdsOwnedByUser] = useState([])
    const [totalDisciplesStaked, setTotalDisciplesStaked] = useState('')
    const [totalDisciplesStakedMint, setTotalDisciplesStakedMint] = useState('')
    const [isDisciplesApproved, setIsDisciplesApproved] = useState(false)
    const [disciplesStaked, setDisciplesStaked] = useState([]);
    const [rewardsEarned, setRewardsEarned] = useState('');

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}))
    }

    const updateValues = async (acct) => {
        const stakingContract = getEthereumContract(disciplesLairContractAddress, disciplesLairContractAbi)
        const getStakedDisciples = await stakingContract.tokensOfOwner(acct);
        const arr = toArray(getStakedDisciples)
        const unstakedTokens = await getNftOwnedByUser(acct, contractAddress, false)
        const getRewards = await stakingContract.earningInfo(acct, arr);
        const disciplesStaked = await stakingContract.totalStaked();
        const disciplesStakedByUser = await stakingContract.balanceOf(acct)
    
            setTotalDisciplesStaked(disciplesStaked)
            setTotalDisciplesStakedMint(DisciplesStakedRequirement(disciplesStakedByUser));
            setRewardsEarned(ethers.utils.formatEther(getRewards[0]))
            setDisciplesStaked(arr)
            setTokenIdsOwnedByUser(unstakedTokens)
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
        
            


            // getAllTransactions();
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

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask!");

            const { amount } = formData;
            const cultNFTContract = getEthereumContract(contractAddress, contractABI);
            const payable = mintPrice * amount;

        const transactionHash = await cultNFTContract.mint(amount, {value: ethers.utils.parseEther(payable.toString())});
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`)

        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const mintAetherCrystal = async () => {
        try {
            if(!ethereum) return alert("Please install metamask!");

            const { amount } = formData;
            const aetherCrystalContract = getEthereumContract(CrystalAddress, contractABI);

        const transactionHash = await aetherCrystalContract.mint(amount);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`)

        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const approveDisciples = async () => {
        try {
            if(!ethereum) return alert("Please install metamask!");

            const cultNFTContract = getEthereumContract(contractAddress, contractABI);

        const transactionHash = await cultNFTContract.setApprovalForAll(disciplesLairContractAddress, true);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`)
        const disciplesApproved = await cultNFTContract.isApprovedForAll(currentAccount, disciplesLairContractAddress);
        setIsDisciplesApproved(disciplesApproved)
        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const stakeCult = async (input) => {

        console.log("Staking Tokens:", input)
        try {
            if(!ethereum) return alert("Please install metamask!");

            const contract = getEthereumContract(disciplesLairContractAddress, disciplesLairContractAbi);

        const transactionHash = await contract.stake(input);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`)
        updateValues(currentAccount);

        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const unstakeCult = async (input) => {

        console.log("Unstaking Tokens:", input)
        try {
            if(!ethereum) return alert("Please install metamask!");

            const contract = getEthereumContract(disciplesLairContractAddress, disciplesLairContractAbi);

        const transactionHash = await contract.unstake(input);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`)
        updateValues(currentAccount);

        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const claimRewards = async () => {

        console.log("Claiming Rewards For:", disciplesStaked)
        try {
            if(!ethereum) return alert("Please install metamask!");

            const contract = getEthereumContract(disciplesLairContractAddress, disciplesLairContractAbi);
        const transactionHash = await contract.claim(disciplesStaked);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`)
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`)
        updateValues(currentAccount);

        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <CultNFTContext.Provider value={{crystalsMinted, totalDisciplesStakedMint, mintAetherCrystal, rewardsEarned, claimRewards, approveDisciples, unstakeCult, connectWallet, disciplesStaked, totalDisciplesStaked, currentAccount, formData, isDisciplesApproved, setFormData, handleChange, sendTransaction, stakeCult, isLoading, amountMinted, isConnectedToMainnet, tokenIdsOwnedByUser }}>
            {children}
        </CultNFTContext.Provider>
    );
}