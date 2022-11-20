import { Navbar, Welcome, Collections, Footer, Marketplace, Token, Wallet, WalletListed } from "./components"
import React from 'react';
import {Outlet} from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'


import { TransactionProvider } from './context/WalletContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TransactionProvider>
  

    <React.StrictMode>
      <BrowserRouter>

        <div className='min-h-screen gradient-bg-welcome'>
      <div className="pb-20">
        <Navbar />
        <div className="h-[1px] w-full bg-matrix-dark-green flex flex-center" />
        <Routes>
          <Route path='/' element={<Welcome />}/>
          <Route path='/Collections' element={<Collections />}/>
          <Route path='/Collections/:address' element={<Marketplace />}/>
          <Route path='/Collections/:address/:tokenId' element={<Token />}/>
          <Route path='/Wallet/:address' element={<Wallet />}/>
          <Route path='/Wallet/:address/Listed' element={<WalletListed />}/>
        </Routes>
        <div className="h-[1px] w-full bg-matrix-dark-green mt-8 flex flex-center" />
      </div>
      <Footer />
    </div>

      </BrowserRouter>
    </React.StrictMode>
  </TransactionProvider>
)
