const charCountWrap = document.getElementById('charCountWrap')
const charCount = document.getElementById('charCount')

const messageInput = document.getElementById('messageInput')
      messageInput.addEventListener('keyup',(ev)=>{

        var len = ev.target.value.length;

        charCount.innerText = len
        
        if(len < 150){
            charCountWrap.style.color = "black"

        } else if(len > 180 && len < 222){
            charCountWrap.style.color = "red"

        } 
      
      })

const stampModalWrap = document.getElementById('stampmodal_wrap')
const finalStampWrap = document.getElementById('finalStampWrap')
const finalStamp = document.getElementById('finalstamp')

const showStampSelection = ()=>{
  stampModalWrap.style.display = "flex"
}

const updateStamp = src => {
  finalStampWrap.dataset.before = ""
  finalStampWrap.style.backgroundImage = "unset"
  stampModalWrap.style.display = "none"
  finalStamp.src = src
}

let singleUser = {
  name: "",
  address: ""
}
const recipientmodalwrap = document.getElementById('recipientmodal_wrap')
const addAddressBtn = document.getElementById('addAddressBtn')
const recipientFinalTitle = document.getElementById('recipientFinalTitle')

const showAddressInputs = () => {
    recipientmodalwrap.style.display = "flex"
}
const addSingleRecipient = () => {

    const recipientName = document.getElementById('recipientName1').value
    const recipientAddress = document.getElementById('recipientAddress1').value

    singleUser = {
      name: recipientName,
      address: recipientAddress
    }
    console.log(recipientName);
    recipientFinalTitle.innerText = `Dear ${recipientName}`;
    recipientFinalTitle.innerHTML = `Dear ${recipientName} <span style="font-size:12px; opacity:0.4">(${recipientAddress.substr(0, 5)}...)</span>`;
    addAddressBtn.innerText = "Edit"

    recipientmodalwrap.style.display = "none"

}

const sendMessageBtn = document.getElementById('sendMessageBtn')
const transactionModalWrap = document.getElementById('transactionmodal_wrap')
const transactionmessage = document.getElementById('transactionmessage')

const sendMessage = () => {
  transactionModalWrap.style.display = "flex";
  transactionmessage.innerText = "Sending Your Message..."

  setTimeout(() => {
    transactionmessage.innerText = "Message Sent!"

    setTimeout(() => {
      window.location.reload();

    }, 5000);

  }, 2500);
}


const connectWalletBtn = document.getElementById('inboxStatus')
const inboxBtnwrap = document.getElementById('inboxBtnwrap')
const inboxCount = document.getElementById('inboxCount')
const connectWallet = () => {
  connectWalletBtn.innerText = "Inbox"
  inboxCount.style.display = "flex"
  inboxBtnwrap.style.marginRight = "27px"
}