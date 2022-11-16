import fetch from 'node-fetch';
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

console.log(await getCantoTx('0xc0c73ccfee66eb400accee23fe70369186e4d3c9', '0xcFD433DDA9466e55Fd063f4Be3f3A985d169f140'))