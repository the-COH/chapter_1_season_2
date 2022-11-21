import { Network, Alchemy } from 'alchemy-sdk';
import { floor } from 'mathjs';
import { SiOpenstreetmap } from 'react-icons/si';
import { settings, testsettings } from './constants.js';
import { contractAddress } from './constants.js';
import { getEthereumContract } from "../context/WalletContext";
import { contractABI } from "./constants";
import { fetchMetadataForToken } from './getJsonData.js';

// export const settings = {
//     apiKey: 'vkbFSDxyMa6TG-fwVQ0v5z9L_PieT5Vm', // Replace with your Alchemy API key.
//     network: Network.ETH_MAINNET // Replace with your network.
//   };

const alchemy= new Alchemy(settings);
const test = new Alchemy(testsettings)
export async function getNftOwnedByUser(ownerAddress, contract, getMetadata=false) {
    var nftTokenIds = [];
    if (getMetadata == true) {
        for await (const nft of alchemy.nft.getNftsForOwnerIterator(ownerAddress, {contractAddresses: [contract]})) {
            nftTokenIds.push(nft);
        }
            console.log(nftTokenIds)
            return nftTokenIds
    } else {
        for await (const nft of alchemy.nft.getNftsForOwnerIterator(ownerAddress, {contractAddresses: [contract], omitMetadata: true})) {
            nftTokenIds.push(nft.tokenId);
        }
            console.log(nftTokenIds)
            return nftTokenIds
    }
}

export async function getFloorPrice() {
    let floor = 0.04;
    const floorPrice = await test.nft.getFloorPrice(contractAddress)
    if (floorPrice.openSea.floorPrice > 0) {
        floor = floorPrice.openSea.floorPrice;
    } else {

        floor = 0.03;
    }
    console.log(floorPrice)
    return floor
}

// const contract = '0xC8BcbE0E8ae36D8f9238cd320ef6dE88784B1734'
// getNftOwnedByUser('emmanft.eth', contract, false)



export async function getTokensHeldByUser(tokenAddress, userAddress) {
    const nftContract = getEthereumContract(tokenAddress, contractABI)
    const totalSupply = (await nftContract.totalSupply()).toString() * 1;
    const balanceOf = await nftContract.balanceOf(userAddress);
    let tokensOwnedByUser = [];

    let counter = 0;
    for(let i=0; i <= totalSupply-1; i++) {
        if(counter == balanceOf) {
            return tokensOwnedByUser
        }
        const ownerOf = await nftContract.ownerOf(i)
        if(ownerOf.toString().toUpperCase() == userAddress.toUpperCase()) {
            tokensOwnedByUser.push(i)
            counter += 1;
        }
    }

    return tokensOwnedByUser;
}