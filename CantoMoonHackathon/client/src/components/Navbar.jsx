import React, { useContext } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from 'react-icons/ai';
import { shortenAddress } from '../utils/shortenAddress';
import { WalletContext } from '../context/WalletContext';
import CantoMoon from '../../images/CantoMoon.png'

import logo from '../../images/logo.png';
import { Wallet } from 'ethers';


const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const { connectWallet, currentAccount } = useContext(WalletContext);
    
    const NavbarItem = ({title, classProps}) => {
        let link=`/${title}`;
        if(title == 'Wallet') {
            link = `/Wallet/${currentAccount}`
        }
        return (
            <li className={'mx-4 my-3 sm:my-0 cursor-pointer ${classProps}, hover:text-matrix-green'}>
                <Link to={link}>{title}</Link>
            </li>
        )
    }

    return (
    
        <nav className="w-full flex p-4">
             <div className=' sm:grid grid-cols-3 gap-4 w-full justify-start'>
                <div className='flex-col col-span-1 items-start ml-2 md:ml-8 flex justify-start  w-16 cursor-pointer'>
                <Link to="/">
                 <img src={CantoMoon} alt="logo" className="" />
                 </Link>
                 </div>
            <ul className='flex flex-row col-span-2 text-white text-sm sm:text-md md:flex hidden flex-initial justify-end items-center'>
                {["Collections",  "Wallet"].map((item, index) => (
                    <NavbarItem key={item + index} title={item}/>
                    ))}
                    
                    {!currentAccount ? (
                                <button
                                type='button'
                                onClick={connectWallet}
                                className=" bg-matrix-dark-green py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-matrix-green">
                                <p className="text-white text-base font-semibold text-xs">
                                Connect Wallet
                                </p>
                            </button>
                            ) : (
                                <button
                                type='button'
                                onClick={connectWallet}
                                className="bg-matrix-dark-green py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-matrix-green">
                                <p className="text-white text-base font-semibold text-xs">
                                {shortenAddress(currentAccount)}
                                </p>
                            </button>
                            )}
            </ul>
            </div>
            <div className="flex relative sm:pr-4">
                
                {toggleMenu
                    ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)}/>
                    
                    : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)}/>}
                                        <div>

                    </div>
                    {toggleMenu && (
                        <ul
                            className='z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                                flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in
                            '
                        >
                            <li className='text-xl w-full my-2'>
                                <AiOutlineClose onClick={() => setToggleMenu(false)} />
                            </li>
                            {["Collections", "Wallet"].map((item, index) => (
                    <NavbarItem key={item + index} title={item} classProps="my-2 text-sm"/>
                    ))}
                                        {!currentAccount ? (
                                <button
                                type='button'
                                onClick={connectWallet}
                                className=" bg-matrix-dark-green py-2  mx-4 rounded-full cursor-pointer hover:bg-matrix-green">
                                <p className="text-white text-base font-semibold text-xs">
                                Connect Wallet
                                </p>
                            </button>
                            ) : (
                                <button
                                type='button'
                                onClick={connectWallet}
                                className="bg-matrix-dark-green py-2 px-3 mx-4 rounded-full cursor-pointer hover:bg-matrix-green">
                                <p className="text-white text-base font-semibold text-xs">
                                {shortenAddress(currentAccount)}
                                </p>
                            </button>
                            )}
                        </ul>
                    )}

            </div>
            
        </nav>
    )
}

export default Navbar;