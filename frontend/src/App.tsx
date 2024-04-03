import './App.css';
import React, { useEffect } from 'react';

import { AppProvider } from './context/AppContext';
import TopBar from './components/TopBar';
import NavBar from './components/NavBar';

import '@near-wallet-selector/modal-ui/styles.css';
import { NearWalletContext, useNearWallet } from './lib/useNearWallet';
import { ContractName } from './lib/constant';
import TokensPage from './pages/Tokens/TokensPage';

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const nearWallet = useNearWallet({ createAccessKeyFor: ContractName, network: 'mainnet' });

  useEffect(() => {
    (async () => {
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode) {
        setIsDarkMode(darkMode === 'true');
      }
    })();
  }, []);

  return (
    <div className="flex screenHeight">
      <NearWalletContext.Provider value={nearWallet}>
        <AppProvider
          value={{
            isDarkMode,
            toggleDarkMode: () => setIsDarkMode(!isDarkMode)
          }}
        >
          <div className="flexBasis17">
            <NavBar />
          </div>
          <div className="flexBasis83 fixedWrapper">
            <TopBar
              isDarkMode={isDarkMode}
              handleSearch={() => {}}
              requestSignIn={async () => {
                nearWallet.signIn();
              }}
              isConnected={nearWallet.isConnected()}
              requestSignOut={() => nearWallet.signOut()}
            />
            <TokensPage />
          </div>
        </AppProvider>
      </NearWalletContext.Provider>
    </div>
  );
}

export default App;
