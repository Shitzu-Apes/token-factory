import React from 'react';
import ReactDOM from 'react-dom/client';
import { Web3OnboardProvider, init } from '@web3-onboard/react';

import App from './App';
import './index.css';

const web3Onboard = init({
  wallets: [],
  chains: []
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <App />
    </Web3OnboardProvider>
  </React.StrictMode>
);
