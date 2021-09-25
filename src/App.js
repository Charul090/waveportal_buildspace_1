import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

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
      </div>
    </div>
  );
}
