import React from 'react';
import { useContext } from 'react';
import Telegram from '../../images/Telegram.svg';
import Discord from '../../images/Discord.svg';
import Twitter from '../../images/Twitter.svg';
import { WalletContext } from '../context/WalletContext';


const Footer = () => {
   const {addTokenToWallet} = useContext(WalletContext);
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className='flex items-center pb-3'>
             <a href='https://t.me/cantomoon' target="_blank">
                <img src={Telegram} alt="Opensea" href='https://t.me/cantomoon' className="w-16 mx-5 cursor-pointer "/>
             </a>

             {/* <a href='' target="_blank">
                <img src={Discord} alt="Discord"  className="w-16 mx-5 cursor-pointer "/>
             </a> */}
             <a href='https://twitter.com/Canto_Moon' target="_blank">
                <img src={Twitter} alt="twitter"  className="w-16 mx-5 cursor-pointer "/>
             </a>
            </div>
            <button 
               type='button'
               onClick={(e) => (addTokenToWallet())}
               className="text-white border-[1px] m-2 p-2 border-[#3d4f7c] rounded-full hover:text-green-500 cursor-pointer">
                  Add Tokens To Wallet
            </button>
            <div className='text-center p-3 text-white'>
             © 2022 Copyright:
                <a className='text-white'>
                  CantoMOON
             </a>
             </div>
          </div>
      );
    }

export default Footer;