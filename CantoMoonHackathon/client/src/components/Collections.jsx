import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import Banner from '../../images/Banner.png'
import { GetCollections } from '../utils/getJsonData';
import { WalletContext } from "../context/WalletContext";





    
const Collection = ({collectionData}) => {
    const image = collectionData.Image;
  return (
      <button className="text-xs md:text-ms py-3 items-center sm:mx-4 md:mx-4 text-center cursor-pointer w-full sm:w-1/3 md:w-1/5 transform transition hover:-translate-y-0.5 hover:outline-none hover:outline-green-500">
          <Link to={`/Collections/${collectionData.Address}`}><img src={image} alt='Cult NFT' className='text-center rounded md:object-scale-down shadow-lg hover:shadow-green-500 outline-none mb-3'/>
            {collectionData.Name}</Link>
      </button>
  )
  }


const Collections = () => {
    
    const { formData} = useContext(WalletContext);
    const [collectionList, setCollectionList] = useState([])
    const getCols = async () => {
        const collectionList = await GetCollections();
        setCollectionList(collectionList)
    }

    useEffect(() => {
        getCols();
    }, []);

    return (
        <div className="flex w-full flex-col justify-center items-center">
            <div className='items-center w-full h-30 sm:h-48'>
            <img src={Banner} alt='Exlore Collections' className='object-cover w-full h-30 sm:h-48'/>
            </div>

            <div className="h-[1px] w-full bg-matrix-dark-green mb-10 my-2 flex flex-center" />

            <div className='flex flex-row w-1/2 md:w-3/4'>
                <ul className='text-white md:flex flex-wrap flex-col md:flex-row justify-center items-center'>
                        {collectionList.map((item, index) => (
                            <Collection 
                              type='button' 
                              key={item.Name}
                              collectionData={item}
                              />
                            ))}
                    </ul>

            </div>
        </div>
        

    )
}

export default Collections;