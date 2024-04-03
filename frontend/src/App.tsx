import React, { useEffect } from 'react';

import TopBar from './components/TopBar';

import '@near-wallet-selector/modal-ui/styles.css';
import { NearWalletContext, useNearWallet } from './lib/useNearWallet';
import { ContractName } from './lib/constant';
import TokensPage from './pages/Tokens/TokensPage';
import Hero from './Hero';

function App() {
  const nearWallet = useNearWallet({ createAccessKeyFor: ContractName, network: 'mainnet' });

  return (
    <div className="flex flex-col min-h-screen">
      <NearWalletContext.Provider value={nearWallet}>
        <div className="w-full">
          <TopBar
            handleSearch={() => {}}
            requestSignIn={async () => {
              nearWallet.signIn();
            }}
            isConnected={nearWallet.isConnected()}
            requestSignOut={() => nearWallet.signOut()}
          />
          <Hero />
          <TokensPage />
        </div>
      </NearWalletContext.Provider>
    </div>
  );
}

export default App;
