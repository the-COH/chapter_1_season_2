import { Navbar, Welcome, Services, Footer } from "./components"
import React from 'react';
import {Outlet} from 'react-router-dom';

const Home = () => {

  return (
    <div className='min-h-screen gradient-bg-welcome'>
      <div className="pb-20">
        <Outlet />
        <Welcome />
        <div className="h-[1px] w-full bg-gray-400 my-2 flex flex-center" />
      </div>
      <Services />
      <div className="pt-20">
      <Footer />
      </div>
    </div>
  );
}

export default Home;