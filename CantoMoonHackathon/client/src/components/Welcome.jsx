import React, { useContext } from 'react';
import { Services} from "../components"
import CantoMoon from '../../images/CantoMoon.png'
import { Link } from 'react-router-dom';


const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {

    return (
        <div className="flex w-full flex-col justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-20">
                <div className="flex flex-col flex-1 items-center justify-center  mf:mt-0 mt-10">
                    <h1 className="text-6xl text-center sm:text-5xl text-matrix-green drop-shadow-md py-10 ">
                        Welcome To The Moon
                    </h1>
                    {/* <div className="h-[1px] w-full bg-matrix-dark-green my-1 mr-5"/> */}
                    <p className="text-center mt-1 text-white font-light md:w-9/12 w-11/12 text-base">
                        Cantos 100% on chain NFT Marketplace. Home of $CMOON
                    </p>
                    <Link to='/Collections'>
                        <button 
                            type='button'
                            onClick=''
                            className="mt-20 item-center justify-center text-white w-3/4 mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full hover:text-matrix-green cursor-pointer blue-glassmorphism">
                                Explore Collections
                        </button>
                    </Link>
                </div>

                <div className='flex flex-col flex-1 items-center justify-center w-full mf:mt-0 mt-10'>

                    <div className="justify-end items-center flex-col rounded-xl h-50 sm:w-72 w-full my-2">
                    <h1 className='flex justify-center items-center text-center text-matrix-green text-2xl pb-5'>Featured Collection</h1>

                        <img src={CantoMoon} alt='Cult NFT' className='rounded object-scale-down'/>
                        <button 
                        type='button'
                        // onClick={handleSubmit}
                        className="text-white mt-4 w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full hover:text-matrix-green cursor-pointer">
                            Coming Soon!
                        </button>
                    </div>
    



                </div>

            </div>
            <div className="h-[1px] w-full bg-matrix-dark-green mb-10 my-2 flex flex-center" />
            <Services />
        </div>
        

    )
}

export default Welcome;