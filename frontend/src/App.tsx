import Footer from './components/Footer';
import Hero from './components/Hero';
import TopBar from './components/TopBar';
import { ContractName } from './lib/constant';
import { NearWalletContext, useNearWallet } from './lib/useNearWallet';
import TokensPage from './pages/TokensPage';

import '@near-wallet-selector/modal-ui/styles.css';

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
        <Footer />
      </NearWalletContext.Provider>
    </div>
  );
}

export default App;
