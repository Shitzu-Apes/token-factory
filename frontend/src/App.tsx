import TopBar from './components/TopBar';

import '@near-wallet-selector/modal-ui/styles.css';
import { NearWalletContext, useNearWallet } from './lib/useNearWallet';
import { ContractName } from './lib/constant';
import TokensPage from './pages/TokensPage';
import Hero from './components/Hero';

function App() {
  const nearWallet = useNearWallet({ createAccessKeyFor: ContractName, network: 'mainnet' });

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
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
