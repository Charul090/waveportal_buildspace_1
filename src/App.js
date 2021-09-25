import React,{  useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  const [ address, setAddress] = useState('');

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
        setAddress(accounts[0])
      }
    
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
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

  const wave = () => {
    
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

        <button className="waveButton" onClick={wave}>
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
