
import { getEthereumContract } from "../context/WalletContext";
import { contractABI } from "./constants";
import { formatUnits } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import { getCantoTx } from "./getJsonData";

export async function getTokensOfUser(tokenAddress, userAddress) {

  const contract = getEthereumContract(tokenAddress, contractABI);
  // Get the tokens that the account received
  const eventsReceivedTokens = contract.filters.Transfer(null, userAddress);
  console.log(eventsReceivedTokens)



  // Count the number of times the account received the token
  let receivedTokensCount = {};
  for (let key in eventsReceivedTokens) {
    console.log(key)
    let tokenId = eventsReceivedTokens[key]["returnValues"]["tokenId"];

    receivedTokensCount[tokenId] = (receivedTokensCount[tokenId] || 0) + 1;
  }

  return receivedTokensCount
}

function addressEqual(a, b) {
  return a.toUpperCase() === b.toUpperCase();
}

export async function listTokensOfOwner( tokenAddress, account) {
  const token = getEthereumContract(tokenAddress, contractABI);

  const balanceOf = (await token.balanceOf(account)).toString();
  console.log('Balance OF', balanceOf)
  if(balanceOf == 0) {
    return []
  }
 

  const sentLogs = await token.queryFilter(
    token.filters.Transfer(account, null),
  );
  const receivedLogs = await token.queryFilter(
    token.filters.Transfer(null, account),
  );

  const logs = sentLogs.concat(receivedLogs)
    .sort(
      (a, b) =>
        a.blockNumber - b.blockNumber ||
        a.transactionIndex - b.transactionIndex,
    );

  const owned = new Set();

  for (const log of logs) {
    const { from, to, tokenId } = log.args;
    if (addressEqual(to, account)) {
      owned.add(tokenId.toString());
    } else if (addressEqual(from, account)) {
      owned.delete(tokenId.toString());
    }
  }

 
  

  return [...owned]
};

export async function listTokensOfOwnerCanto( tokenAddress, account) {
  const token = getEthereumContract(tokenAddress, contractABI);
  console.log(tokenAddress)
  const balanceOf = (await token.balanceOf(account)).toString();
  if(balanceOf == 0) {
    return []
  }
 

  const receivedLogs = await getCantoTx(tokenAddress, account)

  const logs = receivedLogs
    .sort(
      (a, b) =>
        a.blockNumber - b.blockNumber ||
        a.transactionIndex - b.transactionIndex,
    );
  const owned = new Set();

  for (const log of logs) {
    const from = log['from'];
    const to = log['to']
    const tokenID = log['tokenID']
    if (addressEqual(to, account)) {
      owned.add(tokenID.toString());
    } else if (addressEqual(from, account)) {
      owned.delete(tokenID.toString());
    }
  }

  return [...owned]
};
