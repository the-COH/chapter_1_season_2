import { GiHood } from "react-icons/gi";
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { GiMining } from 'react-icons/gi';
import { FaCoins } from 'react-icons/fa';
import { SiDiscord } from 'react-icons/si'


const ServiceCard = ( {color, title, icon, subtitle} ) => (
    <div className="flex flex-row justify-center items-center white-glassmorphism p-3 pb-7 mb-5 m-2 cursor-pointer hover:shadow-lg hover:shadow-green-600 max-w-4xl">
        <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
            {icon}
        </div>
        <div className="ml-5 items-center flex flex-col flex-1">
            <h1 className="mt-2 text-center text-matrix-green text-lg">{title}</h1>
            <p className="mt-2 text-center text-white text-sm md:w-9/12">{subtitle}</p>

        </div>
    </div>
);

const Services = () => {
    return (
       <div className="flex flex-col w-full justify-center items-center gradient-bg-services">
        <div className="flex flex-col items-center justify-center py-2 px-4">
            <div className="flex-1 flex flex-col justify-center items-center">
                <h1 className="text-matrix-green text-lg sm:text-3xl mb-10 text-white item-center">The $CMOON Ecosystem</h1>
            </div>
        </div>
        <div className="flex-1 flex flex-col justify-start items-center">
            <ServiceCard 
                color="bg-matrix-dark-green"
                title="$CMOON Tokenomics"
                icon={<FaCoins fontSize={21} className="text-white"/>}
                subtitle="6% Total TX Tax, 3% Auto LP, 3% Dev/Marketing, 2% Max per TX"
            />
            <ServiceCard 
                color="bg-matrix-dark-green"
                title="Liquidity Mining"
                icon={<GiMining fontSize={21} className="text-white"/>}
                subtitle="Provide liquidity for CMOON/CANTO and stake your LP tokens to earn $FUEL"
            />
            <ServiceCard 
                color="bg-matrix-dark-green"
                title="Mint Canto Rockets NFT"
                icon={<BsFillPersonPlusFill fontSize={21} className="text-white"/>}
                subtitle="Users who stake LP, burn $CMOON and $FUEL can mint a Canto Rocket"
            />

             <ServiceCard 
                color="bg-matrix-dark-green"
                title="Stake Canto Rockets"
                icon={<FaCoins fontSize={21} className="text-white"/>}
                subtitle="Fees earned from the marketplace will be used to buyback $CMOON and provide it to Canto Rocket Stakers"
            />

        </div>
       </div>
    )
}

export default Services;