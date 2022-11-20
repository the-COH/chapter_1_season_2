const gasModalWrap = document.getElementById('gasmodal_wrap')
const gasmessage = document.getElementById('gasmessage')
const gasLeft = document.getElementById('gasLeft')

const getGas = () => {

  gasModalWrap.style.display = "flex";
  gasmessage.innerText = "Requesting Gas..."

  setTimeout(() => {
      const current = gasLeft.innerText
      console.log(current);
      if(current === "0" ) {
        console.log("what");
        gasmessage.innerText = "No more gas available for this address."
        setTimeout(() => {
            gasModalWrap.style.display = "none";
                  }, 1400);
    
        return 
      } else {
          gasmessage.innerText = "0.5 Canto Sent!"

      }

    setTimeout(() => {
        gasModalWrap.style.display = "none";
      
      gasLeft.innerText = current - 1
    }, 1400);

  }, 1200);
}

const transferConnectWallet = document.getElementById('transferConnectWallet')
const transferInputWrap = document.getElementsByClassName('transferInputWrap')[0]
const connectBtnTxt = document.getElementById('inboxStatus')

const showTransferInputBtn = ()=>{
    transferConnectWallet.style.display = "none"
    transferInputWrap.style.display = "flex"
    connectBtnTxt.innerText = "Inbox"

}
const selectBird = ev => {
    ev.className = "mintbird selected"
}

const mintModalWrap = document.getElementById('mintmodal_wrap')
const mintmessage = document.getElementById('mintmessage')

const mintBird = () => {

    mintModalWrap.style.display = "flex";
    mintmessage.innerText = "Providing gas for the whole community..."
  
    setTimeout(() => {

          mintmessage.innerHTML = "Thank you for your generous donation! <br>Your bird is on its way."
  
      setTimeout(() => {

          mintModalWrap.style.display = "none";
        
      }, 1600);
  
    }, 1900);
  }
