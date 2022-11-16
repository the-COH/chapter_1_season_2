import React, { useContext,useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'
import { getBulkMetadata, GetCollections } from '../utils/getJsonData';
import {TbWorld} from 'react-icons/tb';
import { getEthereumContract } from '../context/WalletContext';
import marketplaceAbi from "../utils/Marketplace.json"
import { nftVaultAddress } from '../utils/constants';
import { parseListedNfts, sortAscending } from '../utils/parseListedNfts';
import { fetchMetadata } from '../utils/getJsonData';
import {contractABI} from '../utils/constants';
import { formatUnits } from 'ethers/lib/utils';
import Twitter from '../../images/Twitter.svg';
import { ethers } from 'ethers';
import { listTokensOfOwnerCanto } from '../utils/getTokensOfUser';


//gets current pages collection



const Marketplace = () => {
    const { address } = useParams();



    const [listedNfts, setListedNfts] = useState([]);
    const [listedNftMetadata, setListedNftMetadata] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentCollection, setCurrentCollection] = useState({});
    const [totalVolume, setTotalVolume] = useState('');
    const [floor, setFloor] = useState('');
    const [totalSupply, setTotalSupply] = useState('Unknown');
    const [listings, setListings] = useState('No Listings');
    

    const getListedtest = async () => {
        try {
            const marketplaceContract = getEthereumContract(nftVaultAddress, marketplaceAbi);
            const getListed = sortAscending(parseListedNfts(await marketplaceContract.nftListings(address)));
            return getListed
        } catch(e) {
            console.log(`Error: ${e}`)
            const marketplaceContract = getEthereumContract(nftVaultAddress, marketplaceAbi);
            const tokensHeldByMarketplace = await listTokensOfOwnerCanto(address, nftVaultAddress)
            let listed = []
            for(let i=0; i<tokensHeldByMarketplace.length; i++) {
                console.log(tokensHeldByMarketplace[i])
                listed.push(await marketplaceContract.vaultItems(address, tokensHeldByMarketplace[i]))
            }
            return sortAscending(parseListedNfts(listed));
        }
    }

    const fetchListedNfts = async (acct) => {

        const collectionList = await GetCollections();
        for(let i=0; i < collectionList.length; i++) {
            console.log(collectionList[i].Address)
            if(collectionList[i].Address == address) {
                const currentCollection = collectionList[i];
                setCurrentCollection(currentCollection);
            }
        }
        const marketplaceContract = getEthereumContract(nftVaultAddress, marketplaceAbi);
        const nftContract = getEthereumContract(address, contractABI);
        try {
            const totalSupply = await fetch(`https://evm.explorer.canto.io/api?module=stats&action=tokensupply&contractaddress=${address}`)
        
            if (!totalSupply.ok) {
              throw new Error(`Error! status: ${response.status}`);
            }
        
            const result = await totalSupply.json();
            setTotalSupply(result['result'])
          } catch (err) {
            console.log(err);
          }
       
     
        const getListed = await getListedtest()
        const volume = (formatUnits((await marketplaceContract.vaultInfo(acct)).totalVolume.toString())*1).toFixed(2)
        const bulkMetadata = await getBulkMetadata();


        if(!(bulkMetadata.hasOwnProperty(address))) {
            console.log('Address not listed in bulkData : ', address)
            const getMetadata = await fetchMetadata(getListed, address, true)

            for(let i=0; i < getListed.length; i++) {
                const tokenId = getListed[i]['tokenId'].toString();
                console.log(getMetadata[tokenId]);
                bulkMetadata[address][tokenId] = getMetadata;

            }

        } else {
        for(let i=0; i < getListed.length; i++) {
            const tokenId =getListed[i].tokenId
            if(bulkMetadata[address][tokenId] === undefined) {
                console.log('Bulk metadata does not exist for token:', address)
                const tokenData = await fetchMetadataForToken(tokenId, address)
                bulkMetadata[address][tokenId] = tokenData;
            }
            }
        }


        
        setTotalVolume(volume);
        setListedNftMetadata(bulkMetadata)
        setListedNfts(getListed);
        setIsLoaded(true);
        setFloor((formatUnits((getListed[0].price).toString())*1).toFixed(2))
        setListings(getListed.length)
    
    }  

    useMemo(() => {
        fetchListedNfts(address);

    }, []);


    const ServiceCard = ( {title, subtitle} ) => (
        <div className="flex flex-row justify-center items-center white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-lg hover:shadow-green-600 max-w-4xl">
            <div className="justify-center items-center flex flex-col flex-1">
                <h1 className="mt-2 text-center text-matrix-green text-sm">{title}</h1>
                <p className="mt-2 text-center text-white text-xxs md:w-9/12">{subtitle}</p>

    
            </div>
        </div>
    );
    
        
    const Collection = ({nftData}) => {
        let tokenId = nftData.tokenId.toString() * 1;
        let tokenName = listedNftMetadata[address][tokenId]['name']
        let tokenPrice = (formatUnits(nftData.price.toString())*1).toFixed(2)
        const tokenImage = `https://cantomoon.xyz/images/${address}/${tokenId}${currentCollection['Suffix']}`
        const tokenImageBackup = listedNftMetadata[address][tokenId.toString()]['image']
        if(listedNftMetadata == null) {
        }

      return (
          <button className="blue-glassmorphism rounded text-xs md:text-md my-2 items-center sm:mx-2 md:mx-2 text-center cursor-pointer w-full sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 transform transition hover:-translate-y-0.5 hover:outline-none hover:outline-green-500">
              <Link to={`${tokenId}`}>
                <img src={tokenImage} onError={({ currentTarget }) => {
                    // currentTarget.onerror = null; // prevents looping
                    currentTarget.src=tokenImageBackup;
                    }} alt='Cult NFT' className='text-center w-full rounded object-cover shadow-lg hover:shadow-green-500 outline-none mb-2'/>
                <p className='text-white text-xxxs xl:text-xs xxl:text-sm'>{tokenName}</p>
                <p className='text-matrix-green text-xxxs xl:text-xs xxl:text-sm'>{tokenPrice} CANTO</p>
            </Link>
          </button>
      )

      }

    return (
        <div className="flex w-full flex-col justify-center items-center">
            <div className='items-center w-full h-30'>
            <img src={currentCollection['Banner']} alt='Banner' className='object-cover w-full h-48 bg-blend-overlay'/>
            </div>

            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />

            <div className='flex-row sm:grid grid-cols-7 gap-4 my-10 w-full justify-start'>

                <div className='ml-10 flex justify-start flex-col col-span-3'>
                    <p className='flex text-matrix-green text-3xl'>{currentCollection['Name']}</p>
                    <p className='flex flex-wrap text-white text-xxs mt-2'>{currentCollection['Description']}</p>
                    <div className='flex flex-row items-center'>
                        <a href={currentCollection['Twitter']} target="_blank">
                            <img src={Twitter} alt="twitter"  className="w-8 mx-5 cursor-pointer mt-4 "/>
                        </a>
                        <a href={currentCollection['Website']} target="_blank">
                            <TbWorld color="white" size="35px" className="mx-2 cursor-pointer mt-4" alt='Website'/>
                        </a>
                    </div>
                    
                    
                </div>

                <div className='flex flex-col lg:flex-row justify-center mt-10 sm:mt-0 sm:mr-10 col-span-3 col-end-8'>

                <ServiceCard 
                        title="Floor"
                        subtitle={floor}
                    />
                    <ServiceCard 
                        title="Total Volume"
                        subtitle={totalVolume}
                    />
                    <ServiceCard 
                        title="Listings"
                        subtitle={listings}
                    />
                    <ServiceCard 
                        title="Total Supply"
                        subtitle={totalSupply}
                    />
                </div>

            </div>
            
            <div className="h-[1px] w-full bg-matrix-dark-green mb-1 flex flex-center" />

            <div className='flex-grid-cols-8 w-4/5 gap-4 my-20'>
                    <ul className='text-white flex flex-wrap flex-row justify-center items-center'>
                            
                    {listedNfts.map((item, index) => (
                                <Collection 
                                type='button' 
                                key={item.tokenId.toString()}
                                nftData={item}
                                address={address}
                                />
                                ))}
                        </ul>
                </div>
        </div>
        

    )
}

export default Marketplace;