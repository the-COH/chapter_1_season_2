import React, { useEffect, useState, useMemo  } from 'react';
import { Link, useParams } from 'react-router-dom'
import { fetchMetadataForToken, GetCollections } from '../utils/getJsonData';
import { fetchMetadata } from '../utils/getJsonData';
import Loader from './Loader';
import { getTokensOfUser, listTokensOfOwner, listTokensOfOwnerCanto } from '../utils/getTokensOfUser';
import { add } from 'mathjs'
import { tokenAbi } from '../utils/constants';
import { cmoonAddress } from '../utils/constants';
import { getContractAddress } from 'ethers/lib/utils';
import { getEthereumContract } from '../context/WalletContext';
import { nFormatter } from '../utils/getAPY';
import { ethers } from 'ethers'
import { fetMetadatForAll } from '../utils/getJsonData';
import { getBulkMetadata } from '../utils/getJsonData';

const CHAIN_ID = 7700;
const provider = new ethers.providers.JsonRpcProvider('https://canto.slingshot.finance', CHAIN_ID);

const Wallet = () => {
    const { address } = useParams();

    const [nftsOwnedByUser, setNftsOwnedByUser] = useState([]);
    const [nftMetadata, setNftMetadata] = useState({});
    const [bulkMetadata, setBulkMetada] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false);
    const [cmoonBalance, setCmoonBalance] =useState('');
    const [collectionList, setCollectionList] = useState('');
    const [filters, setFilter] = useState([]);

    const handleClickFilter = (input) => {
        if (filters.includes(input)) {
          const newListItem = filters.filter(address => address !== input)
          return setFilter(newListItem)
        }
        setFilter([... filters, input]);
      }

    const findCurrentCollection = (address) => {
        let currentCollection = null;
        for(let i=0; i < collectionList.length; i++) {
            if(collectionList[i].Address == address) {
                currentCollection = collectionList[i];
                return currentCollection
            }
        }
    }
    
    const fetchNfts = async (acct) => {
        
        const bulkMetadata = await getBulkMetadata();
        const collectionList = await GetCollections();
        
        let nftsOwnedByUser = {}
        let metadata = {}
        if (!ethereum) return alert("Please install MetaMask.");
        const cmoonContact = new ethers.Contract(cmoonAddress, tokenAbi, provider);
        const cmoonBalance = nFormatter(ethers.utils.formatEther((await cmoonContact.balanceOf(address)).toString()), 3)
        setCmoonBalance(cmoonBalance);
        for(let i=0; i < collectionList.length; i++) {
            const tokenAddress = collectionList[i].Address;
            nftsOwnedByUser[tokenAddress] = await listTokensOfOwnerCanto(tokenAddress, address);
            
            if(!(bulkMetadata.hasOwnProperty(tokenAddress))) {
                console.log('Address not listed in bulkData : ', tokenAddress)
                const getMetadata = await fetchMetadata(nftsOwnedByUser[tokenAddress], tokenAddress, true)

                for(let i=0; i < nftsOwnedByUser[tokenAddress].length; i++) {
                    const tokenId = nftsOwnedByUser[tokenAddress][i].toString();
                    console.log(getMetadata[tokenId]);
                    bulkMetadata[tokenAddress] = getMetadata;

                }

            } else {

            for(let i=0; i < nftsOwnedByUser[tokenAddress].length; i++) {
                const tokenId = nftsOwnedByUser[tokenAddress][i]
                if(bulkMetadata[tokenAddress][tokenId] === undefined) {
                    const tokenId = nftsOwnedByUser[tokenAddress][i]
                    console.log('Bulk metadata does not exist for token:', tokenId)
                    console.log(tokenId)
                    const tokenData = await fetchMetadataForToken(tokenId, tokenAddress)
                    bulkMetadata[tokenAddress][tokenId] = tokenData;
                }
                }
            }

        }
        setCollectionList(collectionList)

        
        setNftsOwnedByUser(nftsOwnedByUser)
        
        setIsLoaded(true)

        setNftMetadata(metadata)
        setBulkMetada(bulkMetadata)
    }  

    useMemo(() => {
    

        fetchNfts()


    }, []);

    const Collection = ({token, address}) => {
        let currentCollection = null;
        for(let i=0; i < collectionList.length; i++) {
            if(collectionList[i].Address == address) {
                currentCollection = collectionList[i];

            }
        }
        let tokenId = token * 1;
        const tokenImage = `https://cantomoon.xyz/images/${address}/${tokenId}${currentCollection['Suffix']}`
        const tokenImageBackup = bulkMetadata[address][tokenId.toString()]['image']
        const tokenName = bulkMetadata[address][tokenId.toString()]['name']
      return (
          <button className="blue-glassmorphism rounded text-xs md:text-md my-2 justify-center items-center sm:mx-2 md:mx-2 text-center cursor-pointer w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 transform transition hover:-translate-y-0.5 hover:outline-none hover:outline-green-500">
              <Link to={`/Collections/${address}/${tokenId}`}>
                <img src={`${tokenImage}`} 
                onError={({ currentTarget }) => {
                    currentTarget.src=tokenImageBackup;
                    currentTarget.onerror = null; // prevents looping
                    }} 
                    alt='Loading...' className='text-center w-full rounded object-cover shadow-lg hover:shadow-green-500 outline-none mb-2'/>
                <p className='text-white text-xxxs xl:text-xs xxl:text-sm'>{tokenName}</p>
            </Link>
          </button>
      )

      }

    return (
        <div className="flex w-full flex-col justify-center items-center">
            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />

            <div className='flex-row md:grid grid-cols-7 gap-4 my-10 w-full justify-start'>

                <div className='sm:ml-10 flex justify-start flex-col col-span-3'>
                    <p className='flex text-matrix-green text-3xl'>Account</p>
                    <p className='flex flex-wrap text-white text-xxxs sm:text-xxs mt-2'>{address}</p>
                    <Link to={`/Wallet/${address}/Listed`}>
                      <button  
                        type='button'
                        className="text-white mt-4 w-3/4 mt-2 border-[1px] p-2 border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer">
                            View Listed
                    </button>
                    </Link>
                </div>

                <div className='flex flex-col lg:flex-row justify-center mt-10 md:mt-0 sm:mr-10 col-span-3 col-end-8'>
                <div className='sm:ml-10 flex items-top justify-start flex-col col-span-3'>
                    <p className='flex text-matrix-green text-xl'>$CMOON Balance: </p>
                    {cmoonBalance?
                    <p className='flex flex-wrap md:justify-center text-white text-xs mt-2'>{cmoonBalance}</p>
                    : <></>
                    }
                    <a href={`https://www.cantoswap.fi/#/swap?outputCurrency=0x0a79EB2C804e1e9f2A6a09768c03Ff9C1B2D8028`} className="text-white mt-4 mt-2 
                    border-[1px] p-2 items-center flex justify-center text-center sm:justify-center border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer" target="_blank">
                                Buy $CMOON 
                    </a>

                </div>
                </div>

            </div>
            
            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />

            <div className='flex grid grid-cols-8 w-7/8 gap-2 my-20'>

                {isLoaded?
                <div className='flex flex-col col-span-7 sm:col-span-2 '>
                    <div className='justify-center w-full ml-5 bg-[#19171a] rounded outline outline-matrix-green'>
                        <h1 className='text-xxs sm:text-sm justify-center text-center m-3 text-matrix-green'>Collection Filter</h1>
                        <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center mt-2" />
                        {Object.keys(nftsOwnedByUser).map((tokenAddress, index) => (
                             nftsOwnedByUser[tokenAddress].length > 0 
                                    ? <div key={index} className={`${filters.includes(tokenAddress) ? 'text-matrix-green hover:text-white' : "" }
                                    text-start ml-2 mb-3 text-xxs sm:text-xs text-white hover:text-matrix-dark-green`}
                                    onClick={() => {
                                        console.log('clicked', tokenAddress);
                                        handleClickFilter(tokenAddress);
                                        }}>
                                        <h className='justify-start' key={index}>{(findCurrentCollection(tokenAddress))['Name']}</h>
                                    <p className='justify-end'>({nftsOwnedByUser[tokenAddress].length})</p>
                                    </div>
                                    : <></>
                                
                                    
                        )
                        )}
                    </div>
                    
                </div>
                :<></>
                }
                
                    
                <div className='col-span-8 sm:col-span-6'>
                    {isLoaded && bulkMetadata && nftsOwnedByUser? 
                    <ul className='text-white flex flex-wrap flex-row justify-center items-center'>
                    {Object.keys(nftsOwnedByUser).filter((tokenAddress) => {
                            return filters.length === 0 
                            ? tokenAddress
                            : filters.includes(tokenAddress)
                        }).map((tokenAddress, index) => (
                       nftsOwnedByUser[tokenAddress].map((tokenId, index) => (
                                 <Collection 
                                 type='button' 
                                 key={index}
                                 token={tokenId}
                                 address={tokenAddress}
                                 />
                                 ))

                         ))} </ul>
                     
                     :      <Loader className='flex justify-center'/>              
                    }
    
                    
                    </div>    
                </div>
        </div>
        

    )
}

export default Wallet;