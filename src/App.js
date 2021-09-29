import React,{  useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';
import contract from './constants/contract.js';
import waveportal from './utils/waveportal.json';
import MaterialTable from "material-table";
import useSound from "use-sound";

export default function App() {
  const url = `bell_alert_tone.mp3`;
  const [ address, setAddress] = useState('');
  const [ wished, setWellWishers ] = useState(0);
  const [ wavesList, setWavesList ] = useState([]);
  const [ message, setMessage ] = useState('');
  const [ play ] = useSound(url);

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
        const waveMessage = message || 'N.A';
        const waveTxn = await waveportalContract.wave(waveMessage);

        setMessage('');
        await waveTxn.wait();
      } else {
        console.log('No wallet connected')
      }


    } catch (e) {
      console.log('Error while waving');
      console.log(e);
    }
  }

  const getAllWaves = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contract.waves, waveportal.abi, signer);
  
        const waves = await waveportalContract.getAllWaves();
        const wavesList = waves.map((waveInfo) => {
          return {
            address: waveInfo.waver,
            timestamp: new Date(waveInfo.timestamp * 1000).toLocaleString(),
            message: waveInfo.name
          }
        });
  
        setWavesList(wavesList);

        waveportalContract.on('NewWave', (from, timestamp, message) => {

          const newWavesList = [...wavesList, {
            address: from,
            timestamp: new Date(timestamp * 1000).toLocaleString(),
            message
          }];
          play();
          setWavesList(newWavesList);
          setWellWishers(newWavesList.length);
        });
      } else {
        console.log('Metamask not connected');
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const asyncFn = async () => {
      await checkWalletConnected();
      await getAllWaves();
    }

    asyncFn();
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  }
  
  return (
    <React.Fragment>

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
          <input type='text' value={message} onChange={handleChange} placeholder='Type the message' className="input-field"/>
          <button className="waveButton" onClick={wave} disabled={!address}>
            Wish me luck <span>👍</span>
          </button>
          {
            !address && 
            <button onClick={connectWallet} className="waveButton">
              Connect with MetaMask!
            </button>
          }
        </div>
      </div>
      {
        address && wavesList.length > 0 &&
        <div className='list'>
          <MaterialTable
            columns={[
              { title: 'Address', field: 'address' },
              { title: 'Message', field: 'message' },
              { title: 'Time', field: 'timestamp' }
            ]}
            data={wavesList}
            options={
              {
                showTitle: false,
                toolbar: false
              }
            }
          />
        </div> 
      }
    </React.Fragment>
  );
}
