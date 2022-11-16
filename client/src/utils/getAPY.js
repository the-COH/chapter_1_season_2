import { format, pow } from 'mathjs'

export function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: " k" },
      { value: 1e6, symbol: " Mil" },
      { value: 1e9, symbol: " Bil" },
      { value: 1e12, symbol: " Tril" },
      { value: 1e15, symbol: " Quad" },
      { value: 1e18, symbol: " Quint" },
      { value: 1e21, symbol: " Sext" },
      { value: 1e24, symbol: " Sept" },
      { value: 1e27, symbol: "O" },
      { value: 1e30, symbol: "N" },
      { value: 1e33, symbol: "D" },
      { value: 1e36, symbol: "U" },
      { value: 1e42, symbol: "Td" },
      { value: 1e45, symbol: "Quatturo-D" },
      { value: 1e48, symbol: "Quin-D" },
      { value: 1e51, symbol: "Sd" },
      { value: 1e39, symbol: "" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }


export function calculateApyPerSec(startingBal, rewardRate, rewardPrice) {
    const rewardPerDay = ((rewardRate * rewardPrice)/startingBal)*86400;
    console.log('% per Day', rewardPerDay)
    const rewardPerYear = rewardPerDay * 365
    console.log('APR:', rewardPerYear*100)
    const apr = nFormatter(rewardPerYear*100, 2)
    return apr;
    const apy = (pow(1+(rewardPerYear/365), 365)-1)
    console.log('APY:', apy)
    const formatedApy = nFormatter(apy*100, 2)
    console.log(formatedApy)
    return formatedApy
}

export function calculateApy(startingBal, rewardRate, rewardPrice) {
  const rewardPerDay = ((rewardRate * rewardPrice)/startingBal)*86400;
  console.log('% per Day', rewardPerDay)
  const rewardPerYear = rewardPerDay * 365
  console.log('APR:', rewardPerYear*100)
  const apy = (pow(1+(rewardPerYear/365), 365)-1)
  console.log('APY:', apy)
  const formatedApy = nFormatter(apy*100, 2)
  console.log(formatedApy)
  return formatedApy
}