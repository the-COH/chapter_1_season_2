import React, { useContext,useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { getBulkMetadata, GetCollections } from '../utils/getJsonData';
import { getEthereumContract, getEthereumContractWithSigner } from '../context/WalletContext';
import marketplaceAbi from "../utils/Marketplace.json"
import { nftVaultAddress } from '../utils/constants';
import { fetchMetadataForToken } from '../utils/getJsonData';
import {contractABI} from '../utils/constants';
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils';
import { shortenAddress } from '../utils/shortenAddress';
import { WalletContext } from '../context/WalletContext';
import { add } from 'mathjs';


const { ethereum } = window;

//gets current pages collection

const Input = ({placeholder, name, type, value, handleChange}) => (
    <input
        placeholder={placeholder}
        type={type}
        step="1"
        min='1'
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-center border-none text-xxs white-glassmorphism"
        />

)


const Marketplace = () => {

    const { address } = useParams();
    const { tokenId } = useParams();
    const {currentAccount} = useContext(WalletContext);
    const [nftMetadata, setNftMetadata] = useState([]);
    const [nftPrice, setNftPrice] = useState("");
    const [currentCollection, setCurrentCollection] = useState({});
    const [vaultItem, setVaultItem] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [nftOwner, setNftOwner] = useState('');
    const [isListed, setIsListed] = useState(false);
    const [isOwner, setIsOwner] = useState(false)
    const [isListedAndOwner, setIsListedAndOwner] = useState(false)
    const [formData, setFormData] = useState({ amount: '', account: ''});
   
    
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}))
    }



    const listNft = async (listPrice) => {

        console.log("Listing NFT for:", listPrice)
        try {
            if(!ethereum) return alert("Please install metamask!");

            const marketplaceContract = getEthereumContractWithSigner(nftVaultAddress, marketplaceAbi);
            const nftContract = getEthereumContractWithSigner(address, contractABI);
            const isApproved = await nftContract.isApprovedForAll(currentAccount, nftVaultAddress);
            if(isApproved == false) {
                const transactionHash = await nftContract.setApprovalForAll(nftVaultAddress, true)
                console.log(`Loading - ${transactionHash.hash}`)
                await transactionHash.wait();
            }
            
            const transactionHash = await marketplaceContract.listSale(address, tokenId, parseUnits(listPrice).toString());
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`)

            fetchListedNfts(address, tokenId)
        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const delistNft = async () => {

        console.log("Delisting NFT:", tokenId)
        try {
            if(!ethereum) return alert("Please install metamask!");

            const marketplaceContract = getEthereumContractWithSigner(nftVaultAddress, marketplaceAbi);
            
            const transactionHash = await marketplaceContract.cancelSale(address, tokenId);
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`)

            fetchListedNfts(address, tokenId)
        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const updatePrice = async (listPrice) => {

        console.log("Updating Listprice To:", listPrice)
        try {
            if(!ethereum) return alert("Please install metamask!");

            const marketplaceContract = getEthereumContractWithSigner(nftVaultAddress, marketplaceAbi);
            
            const transactionHash = await marketplaceContract.updateListing(address, tokenId, parseUnits(listPrice).toString());
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`)

            fetchListedNfts(address, tokenId)
        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const buyNft = async (listPrice) => {

        try {
            if(!ethereum) return alert("Please install metamask!");

            const marketplaceContract = getEthereumContractWithSigner(nftVaultAddress, marketplaceAbi);
            console.log(listPrice.toString())
            const transactionHash = await marketplaceContract.buyNft(address, tokenId, {value: parseEther(listPrice.toString())});
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`)

            fetchListedNfts(address, tokenId)
        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const transferNft = async (receiver) => {

        console.log("Transfering NFT to:", receiver)
        try {
            if(!ethereum) return alert("Please install metamask!");

            const nftContract = getEthereumContractWithSigner(address, contractABI);
            
            const transactionHash = await nftContract["safeTransferFrom(address,address,uint256)"](currentAccount, receiver, tokenId);
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`)

            fetchListedNfts(address, tokenId)
        } catch (error) {
            console.log(error);
            return alert(error);
        }
    }

    const fetchListedNfts = async (acct, tokenId) => {

        const collectionList = await GetCollections();
        for(let i=0; i < collectionList.length; i++) {
            if(collectionList[i].Address == address) {
                const currentCollection = collectionList[i];
                setCurrentCollection(currentCollection);
                
            }
        }


        if (!ethereum) return alert("Please install MetaMask.");
        const accounts = await ethereum.request({ method: "eth_requestAccounts", });

        const bulkMetadata = await getBulkMetadata();

        const marketplaceContract = getEthereumContract(nftVaultAddress, marketplaceAbi);
        const nftContract = getEthereumContract(acct, contractABI);
        let owner = await nftContract.ownerOf(tokenId);
        const itemInfo = await marketplaceContract.vaultItems(acct, tokenId);

        const getPrice = (formatUnits((await marketplaceContract.getPrice(acct, tokenId)).toString())*1);

        if(!(bulkMetadata.hasOwnProperty(address))) {
            console.log('Address not listed in bulkData : ', address)
            const getMetadata = await fetchMetadataForToken(tokenId, address)
            let data = {}
            data[tokenId] = getMetadata
            console.log(data)
            bulkMetadata[address] = data;

        } else if(bulkMetadata[address][tokenId] === undefined) {
                console.log('Bulk metadata does not exist for token:', address)
                const tokenData = await fetchMetadataForToken(tokenId, address)
                bulkMetadata[address][tokenId] = tokenData;
            
            
        }

        if(owner == nftVaultAddress) {
            owner = itemInfo['seller']
        }
        if(itemInfo['seller'] != '0x0000000000000000000000000000000000000000') {
            if (owner.toUpperCase() == accounts[0].toUpperCase()) {
                setIsListedAndOwner(true)
                setIsListed(false)
                setIsOwner(false)
            } else {
                setIsListed(true)
                setIsListedAndOwner(false)
                setIsOwner(false)
            }
            
        } else if(owner.toUpperCase() == accounts[0].toUpperCase()) {
            setIsOwner(true)
            setIsListed(false)
            setIsListedAndOwner(false)
        
        } 
  
        setAttributes(bulkMetadata[address][tokenId]['attributes'])
        setNftOwner(owner)
        setVaultItem(itemInfo)
        setNftMetadata(bulkMetadata)
        setNftPrice(getPrice)
    
    }  

    useEffect(() => {
        fetchListedNfts(address, tokenId);

    }, []);


    const ServiceCard = ( {title, subtitle} ) => (
        <div className="flex flex-row justify-center items-center white-glassmorphism p-3 m-2 hover:shadow-sm hover:shadow-green-600 w-full">
            <div className="justify-center items-center flex flex-col flex-1">
                <h1 className="mt-2 text-center text-matrix-green text-xxxs">{title}</h1>
                <p className="mt-2 text-center text-white text-xxxs">{subtitle}</p>
    
            </div>
        </div>
    );
    
    
    return (
        <div className="flex w-full flex-col justify-center items-center">

            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />

            <div className='flex grid grid-cols-2 md:grid-cols-3 gap-10 w-4/5 my-5 sm:my-10 md:my-15 xl:my-20'>
                
                <div className='flex flex-col col-span-2 sm:col-span-1'>
                    

                    <div className="blue-glassmorphism rounded p-5 text-xs md:text-md my-2 items-center sm:mx-2 md:mx-2 text-center w-full transform transition outline-none outline-green-500">
                        {nftMetadata[address] ? 
                            <img src={`https://cantomoon.xyz/images/${address}/${tokenId}${currentCollection['Suffix']}`} onError={({ currentTarget }) => {
                            // currentTarget.onerror = null; // prevents looping
                            currentTarget.src=nftMetadata[address][tokenId]['image'];
                            }} alt={tokenId} className=' shadow-green-500 shadow-lg flex object-cover w-full bg-blend-overlay'/>
                            : <></>
                        }

                        {isListed | isListedAndOwner
                            ? 
                            <div>
                                <p className='justify-center item-center mt-4 text-matrix-green'>{(nftPrice*1).toFixed(2)} CANTO</p>
                            </div>
                            : <p className='justify-center item-center mt-4 text-matrix-green'>Not Listed</p>
                        }

                        {isListed
                            ? 
                            <button  
                            type='button'
                            onClick={(e) => {
                                buyNft((nftPrice*1).toString())}
                            }
                            className="text-white mt-4 w-full mt-2 border-[1px] p-2 border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer">
                                Buy NFT
                            </button>
                            : <></>
                        }

                        {isListedAndOwner
                            ? 
                            
                        <button 
                            type='button'
                            onClick={(e) => {
                                delistNft()}
                            }
                            className="text-white mt-4 w-full mt-2 border-[1px] p-2 border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer">
                                Delist
                        </button>
                            : <></>
                        }

                        

                    </div>
                    
                </div>

                <div className='flex flex-col col-span-2 sm:col-span-1'>
                    

                    <div className="blue-glassmorphism rounded p-5 text-xs md:text-md my-2 items-center sm:mx-2 md:mx-2 text-center w-full transform transition outline-none outline-green-500">
                        <p className='flex justify-start text-matrix-green text-xl sm:3xl'>{currentCollection['Name']}</p>
                        <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />
                        {nftMetadata[address] ? 
                        <div>
                        <p className='flex flex-wrap text-white text-xxs mt-2'>{nftMetadata[address][tokenId]['name']}</p>
                        <p className='flex flex-wrap text-white text-xxs mt-2'>{nftMetadata[address][tokenId]['description']}</p>
                        </div>
                            : <></>
                        }

                        <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center mt-2" />

                        {isOwner | isListedAndOwner ?
                            <a href={`https://evm.explorer.canto.io/address/${nftOwner}`} target="_blank">
                            <p className='flex flex-wrap text-white text-xxs mt-4 cursor-pointer'>Owner: You</p>
                            </a>
                            :                         <a href={`https://evm.explorer.canto.io/address/${nftOwner}`} target="_blank">
                            <p className='flex flex-wrap text-white text-xxs mt-4 cursor-pointer'>Owner: {shortenAddress(nftOwner)}</p>
                            </a>
                        }

                        <a href={`https://evm.explorer.canto.io/token/${address}/instance/${tokenId}/token-transfers`} target="_blank">
                        <p className='flex flex-wrap text-white text-xxs mt-4 cursor-pointer'>Token Id: {tokenId}</p>
                        </a>

                        {isListed | isListedAndOwner ?
                        <p className='flex flex-wrap text-white text-xxs mt-4 cursor-pointer'>List Price: {nftPrice} CANTO</p>
                        : <></>
                        }

                        {isOwner ?
                        <div>
                            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center mt-2" />
                            <Input placeholder="Set List Price"  name="amount" type="text" handleChange={handleChange}/>
                            <button  
                            type='button'
                            onClick={(e) => {
                                const {amount} = formData
                                listNft(amount)}
                            }
                            className="text-white w-full border-[1px] mb-4 p-2 border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer">
                                List
                            </button>

                            <Input placeholder="Address"  name="address" type="text" handleChange={handleChange}/>
                            <button  
                            type='button'
                            onClick={(e) => {
                                const {address} = formData
                                transferNft(address)}
                            }
                            className="text-white w-full border-[1px] p-2 border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer">
                                Transfer NFT
                            </button>
                         </div>
                         : <></>
                        }

                    {isListedAndOwner ?
                        <div>
                            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center mt-2" />
                            <Input placeholder="Update Price To:"  name="amount" type="text" handleChange={handleChange}/>
                            <button  
                            type='button'
                            onClick={(e) => {
                                const {amount} = formData
                                updatePrice(amount)}
                            }
                            className="text-white w-full border-[1px] mb-4 p-2 border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer">
                                Update Price
                            </button>
                         </div>
                         : <></>
                        }


                        


                    </div>

                    

                </div>


                <div className='flex flex-col col-span-2 sm:col-span-1'>
                <div className="blue-glassmorphism rounded p-2 text-xs md:text-md my-2 items-center sm:mx-2 md:mx-2 text-center w-full transform transition outline-none outline-green-500">
                    <ul className=' flex flex-wrap flex-row justify-start items-center'>
                                
                        {attributes.map((item, index) => (
                        <ServiceCard key={index} title={item.trait_type} subtitle={item.value}/>
                        ))}
                    </ul>
                </div>

                </div>


            </div>
        </div>
        

    )
}

export default Marketplace;