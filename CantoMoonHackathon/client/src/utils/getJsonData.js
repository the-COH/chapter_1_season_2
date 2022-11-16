// import fetch from 'node-fetch';
import { getEthereumContract } from "../context/WalletContext";
import { contractABI } from "./constants";
import { formatUnits } from 'ethers/lib/utils';

export async function GetCollections() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/CryptoP00R/CantoMOONMarketplace/main/Collections.json');

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
}
export async function getBulkMetadata() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/CryptoP00R/CantoMOONMarketplace/main/bulkMetadata.json');

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getCantoTx(contractAddress, account) {
  try {
    const response = await fetch(`https://evm.explorer.canto.io/api?module=account&action=tokentx&address=${account}&contractaddress=${contractAddress}`);

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return result['result'];
  } catch (err) {
    console.log(err);
  }
}

export async function fetchMetadata(listedTokens, address, excludePrice=false) {
  let metadataList = {};
  const nftContract = getEthereumContract(address, contractABI)

  
  for(let i = 0; i < listedTokens.length; i++) {
    let tokenId = 0;
    if(excludePrice == false) {
      tokenId = listedTokens[i].tokenId.toString() * 1;
    } else {
      tokenId = listedTokens[i].toString() * 1;
    }

    let tokenUri = await nftContract.tokenURI(tokenId)


  if (tokenUri.slice(0,7) == 'ipfs://') {
      tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  
    try {
          const response = await fetch(tokenUri);
      
          if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }
      
          const result = await response.json();
          if(excludePrice == false) {
            result['price'] = (formatUnits((listedTokens[i].price).toString())*1).toFixed(2);
            
          }
          
          result['tokenId'] = tokenId;
          metadataList[tokenId] = result;
        } catch (err) {
          console.log(err);
        }
      }
   return metadataList;
}

export async function promiseFetchMetadata(listedTokens, address, excludePrice=false) {
  let metadataList = {};
  const nftContract = getEthereumContract(address, contractABI)

  if(excludePrice == false) {
    tokenId = listedTokens[i].tokenId.toString() * 1;
  } else {
    tokenId = listedTokens[i].toString() * 1;
  }

  let tokenUriList = [];
  for(let i = 0; i < listedTokens.length; i++) {
    let tokenId = 0;

    let tokenUri = await nftContract.tokenURI(tokenId)
    if (tokenUri.slice(0,7) == 'ipfs://') {
      tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
    tokenUriList.push(tokenUri)

    const metadata = await Promise.all(tokenUriList.map(url =>
      fetch(url)
  )).then(values => {
      return Promise.all(values.map(r => r.json()));
  }).then(values => {
      for(let i=0; i < listedTokens.length; i++){
        if(excludePrice == false) {
          values[i]['price'] = (formatUnits((listedTokens[i].price).toString())*1).toFixed(2); 
        }
        metadataList[listedTokens[i].tokenId.toString()] = values[i]
      }
      
  }).catch(e => {
    console.log('Caught!')
    console.log(e)  
  })

      }
   return metadataList;
}
export async function fetchMetadataForToken(tokenId, address) {

  const nftContract = getEthereumContract(address, contractABI)

    let tokenUri = await nftContract.tokenURI(tokenId)

  if (tokenUri.slice(0,7) == 'ipfs://') {
      tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
    try {
          const response = await fetch(tokenUri);
        console.log('fetching Response')
          if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }
      
          const result = await response.json();
          return result;
        } catch (err) {
          console.log(err);
        }
   return result;
}


export async function fetMetadatForAll(address) {
  let metadataList = {};
  const nftContract = getEthereumContract(address, contractABI)
  const totalSupply = (await nftContract.totalSupply()).toString()
  console.log(totalSupply )

  let tokenUriList = []
    for(let i = 1; i < totalSupply; i++) {
        let tokenId = i;
        tokenUriList.push(`https://bafybeifphztvxclsq4crwevelzlpbrsueuntiscfe5f5v3xpdny3y5h3yu.ipfs.nftstorage.link/${tokenId}`)
    }
    
    for(let i = 1; i < tokenUriList.length; i++) {
      let tokenId = i;
      try {
          console.log('gettingMetadata for Token:', tokenId)
            const response = await fetch(tokenUriList[i]);
        
            if (!response.ok) {
              throw new Error(`Error! status: ${response.status}`);
            }
        
            const result = await response.json();
              result['tokenId'] = tokenId;

            metadataList[tokenId] = result;
          } catch (err) {
            console.log(err);
          }
        
      }
      console.log[metadataList]
   return metadataList;
}