import React,{  useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';
import contract from './constants/contract.js';
import waveportal from './utils/waveportal.json'

export default function App() {
  const [ address, setAddress] = useState('');
  const [ wished, setWellWishers ] = useState(0);

  const checkWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Wallet Not Connected');
      return;
    }
    console.log('Wallet Connected');

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contract.waves, waveportal.abi, signer);

        const count = await waveportalContract.getTotalWaves();
        setWellWishers(count.toNumber());
      }
    
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(async () => {
    checkWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Download Metamask');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      console.log('Current Account', accounts[0]);
      setAddress(accounts[0]);

    } catch (e) {
      console.log('Error while connecting wallet', e);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contract.waves, waveportal.abi, signer);

        await waveportalContract.getTotalWaves();

        const waveTxn = await waveportalContract.wave();
        await waveTxn.wait();

        const count = await waveportalContract.getTotalWaves();

        console.log(count.toNumber());
        setWellWishers(count.toNumber());
        
      } else {
        console.log('No wallet connected')
      }


    } catch (e) {
      console.log('Error while waving');
      console.log(e);
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>
        <div className="bio">
        I am Charul and this is my first project in Blockchain. Wish me luck!
        </div>
        {
          address &&
          <div className="bio">
          No of well wishers: {wished || ''} 
          </div>
        }

        <button className="waveButton" onClick={wave} disabled={!address}>
          Wish me luck 👍
        </button>
        {
          !address && 
          <button onClick={connectWallet} className="waveButton">
            Connect with MetaMask!
          </button>
        }
      </div>
    </div>
  );
}
