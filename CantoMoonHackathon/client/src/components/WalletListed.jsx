import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'
import { GetCollections } from '../utils/getJsonData';
import { fetchMetadata } from '../utils/getJsonData';
import Loader from './Loader';
import { parseListedNfts, sortAscending } from '../utils/parseListedNfts';
import { getEthereumContract } from '../context/WalletContext';
import { nftVaultAddress } from '../utils/constants';
import marketplaceAbi from "../utils/Marketplace.json"
import { formatUnits } from 'ethers/lib/utils';
import { getBulkMetadata } from '../utils/getJsonData';
import { fetchMetadataForToken } from '../utils/getJsonData';
import { listTokensOfOwnerCanto } from '../utils/getTokensOfUser';


//gets current pages collection



const WalletListed = () => {
    const { address } = useParams();



    const [nftMetadata, setNftMetadata] = useState({});
    const [collectionList, setCollectionList] = useState([]);
    const [nftsListed, setNftsListed] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const getListedtest = async (tokenAddress) => {
        try {
            const marketplaceContract = getEthereumContract(nftVaultAddress, marketplaceAbi);
            const getListed = sortAscending(parseListedNfts(await marketplaceContract.nftListings(tokenAddress)));
            return getListed
        } catch(e) {
            console.log(`Error: ${e}`)
            console.log(`Failted to fetch listings for ${tokenAddress}`)
            const marketplaceContract = getEthereumContract(nftVaultAddress, marketplaceAbi);
            const tokensHeldByMarketplace = await listTokensOfOwnerCanto(tokenAddress, nftVaultAddress)
            let listed = []
            for(let i=0; i<tokensHeldByMarketplace.length; i++) {
                console.log(tokensHeldByMarketplace[i])
                listed.push(await marketplaceContract.vaultItems(tokenAddress, tokensHeldByMarketplace[i]))
            }
            return sortAscending(parseListedNfts(listed));
        }
    }
    const fetchNfts = async (acct) => {
        const bulkMetadata = await getBulkMetadata();
        let metadata = {}
        const collectionList = await GetCollections();
        const marketplaceContract = getEthereumContract(nftVaultAddress, marketplaceAbi);
        if (!ethereum) return alert("Please install MetaMask.");
        let nftsListed = {}
    
        for(let i=0; i < collectionList.length; i++) {
            
            const tokenAddress = collectionList[i].Address;
            console.log('get Listed')
            const getListed = await getListedtest(tokenAddress);
            console.log(getListed)
            let nfts = []
            for(let i=0; i < getListed.length; i++) {
                const token = getListed[i];
                
                if(token['seller'].toUpperCase() == address.toUpperCase()) {
                    nfts.push(token)
                    
                }
            }
            nftsListed[tokenAddress] = nfts
            if(nftsListed[tokenAddress].length > 0) {
                if(!(bulkMetadata.hasOwnProperty(tokenAddress))) {
                    console.log('Address not listed in bulkData : ', tokenAddress)
                    const getMetadata = await fetchMetadata(nftsListed[tokenAddress], tokenAddress)
    
                    for(let i=0; i < nftsListed[tokenAddress].length; i++) {
                        const tokenId = nftsListed[tokenAddress][i].tokenId.toString() * 1;
                        console.log(getMetadata[tokenId]);
                        bulkMetadata[tokenAddress] = getMetadata;
    
                    }
    
                } else {
    
                for(let i=0; i < nftsListed[tokenAddress].length; i++) {
                    const tokenId =nftsListed[tokenAddress][i].tokenId.toString() * 1;
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
           
            
  
            
        }
        setCollectionList(collectionList)
        setIsLoaded(true)
        setNftMetadata(bulkMetadata)
        setNftsListed(nftsListed)
        


    }  

    useMemo(() => {
        fetchNfts(address);
    }, []);


    const ServiceCard = ( {title, subtitle} ) => (
        <div className="flex flex-row justify-center items-center white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-lg hover:shadow-green-600 max-w-4xl">
            <div className="justify-center items-center flex flex-col flex-1">
                <h1 className="mt-2 text-center text-matrix-green text-sm">{title}</h1>
                <p className="mt-2 text-center text-white text-xxs md:w-9/12">{subtitle}</p>
    
            </div>
        </div>
    );
    

    const Collection = ({token, address}) => {
        let currentCollection = null;
        for(let i=0; i < collectionList.length; i++) {
            if(collectionList[i].Address == address) {
                currentCollection = collectionList[i];

            }
        }
        console.log(token)
        let tokenId = nftsListed[address][token].tokenId.toString()
        console.log(tokenId)
        const tokenImage = `https://cantomoon.xyz/images/${address}/${tokenId}${currentCollection['Suffix']}`
        const tokenImageBackup = nftMetadata[address][tokenId.toString()]['image']
        const tokenName = nftMetadata[address][tokenId.toString()]['name']
        let tokenPrice = (formatUnits((nftsListed[address][token].price).toString())*1).toFixed(2);
      return (
          <button className="blue-glassmorphism rounded text-xs md:text-md my-2 items-center sm:mx-2 md:mx-2 text-center cursor-pointer w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 transform transition hover:-translate-y-0.5 hover:outline-none hover:outline-green-500">
              <Link to={`/Collections/${address}/${tokenId}`}>
                <img src={tokenImage} onError={({ currentTarget }) => {
                    // currentTarget.onerror = null; // prevents looping
                    currentTarget.src=tokenImageBackup;
                    }} alt='Loading...' className='text-center w-full rounded object-cover shadow-lg hover:shadow-green-500 outline-none mb-2'/>
                <p className='text-white text-xxxs xl:text-xs xxl:text-sm'>{tokenName}</p>
                <p className='text-matrix-green text-xxxs xl:text-xs xxl:text-sm'>{tokenPrice} CANTO</p>
            </Link>
          </button>
      )

      }

    return (
        <div className="flex w-full flex-col justify-center items-center">
            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />

            <div className='flex-row sm:grid grid-cols-7 gap-4 my-10 w-full justify-start'>

                <div className='sm:ml-10 flex justify-start flex-col col-span-3'>
                    <p className='flex text-matrix-green text-3xl'>Account</p>
                    <p className='flex flex-wrap text-white text-xxxs sm:text-xxs mt-2'>{address}</p>
                    <Link to={`/Wallet/${address}`}>
                    <button  
                        type='button'
                        className="text-white mt-4 w-3/4 mt-2 border-[1px] p-2 border-matrix-dark-green rounded-full hover:text-matrix-green cursor-pointer">
                            View Account
                    </button>
                    </Link>
                </div>

                <div className='flex flex-col lg:flex-row justify-center mt-10 sm:mt-0 sm:mr-10 col-span-3 col-end-8'>

                </div>

            </div>
            
            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />

            <div className='justify-center flex-grid-cols-8 w-4/5 gap-4 my-20'>
                {/* <div className='flex col-span-2'>
                        Trait Filter
                    </div>
                    <div className=' flex justify-center col-span-6 col-end-9'> */}
                    

                    {isLoaded ? 
                    <ul className='text-white flex-wrap flex-row justify-center items-center'>
                    {Object.keys(nftsListed).map((tokenAddress, index) => (
                        Object.keys(nftsListed[tokenAddress]).map((tokenId, index) => (
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



            {/* </div> */}
        </div>
        

    )
}

export default WalletListed;