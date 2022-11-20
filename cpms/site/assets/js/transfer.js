const mintModalWrap = document.getElementById('mintmodal_wrap')
const mintmessage = document.getElementById('mintmessage')
const amountAvailable = document.getElementById('amountAvailable')
const amountToSend = document.getElementsByClassName('amountToSend')[0]

let tempNFT
const transferNft = () => {

    mintModalWrap.style.display = "flex";
    mintmessage.innerText = "Transfering your NFT..."
    setTimeout(() => {

          mintmessage.innerHTML = "Your NFT has been delivered."
  
      setTimeout(() => {

          mintModalWrap.style.display = "none";
          tempNFT.remove()

      }, 1600);
  
    }, 1200);
  }

  const transferCoin = () => {

    mintModalWrap.style.display = "flex";
    mintmessage.innerText = "Transfering your assets..."
    setTimeout(() => {

          mintmessage.innerHTML = "Transfer confimed!"
  
      setTimeout(() => {

          mintModalWrap.style.display = "none";
          amountAvailable.style.display = "none"
          amountToSend.value = ""

      }, 1600);
  
    }, 1200);
  }
const transferConnectWallet = document.getElementById('transferConnectWallet')
const transferWrap = document.getElementsByClassName('transferWrap')[0]
const transferWrap2s = document.getElementsByClassName('transferWrap2s')[0]
const connectBtnTxt = document.getElementById('inboxStatus')
const transferChoice = document.getElementById('transferChoice')
const sendcoins = document.getElementById('sendcoins')

const showOptions = () => {
    transferConnectWallet.style.display = "none"
    transferChoice.style.display = "flex"
    connectBtnTxt.innerText = "Inbox"
}
const showCoins = () => {
    transferChoice.style.display = "none"
    transferWrap2s.style.display = "block"
}
const showNFTs = () => {
    transferChoice.style.display = "none"
    transferWrap.style.display = "block"
}
const selectNFT = (ev,num) => {
    ev.className = "transfernft selected";
    tempNFT = ev
}

const pickAsset = document.getElementById('pickAsset')
const dropdowncontent = document.getElementsByClassName('dropdown__content')[0]

const showCoin = coin => {
    amountAvailable.style.display = "block"
    pickAsset.innerText = coin
    sendcoins.className = "roundedButton button"
}