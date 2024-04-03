import { useEffect, useState } from 'react';

import { AppConsumer } from '../../context/AppContext';

// import styles from './Tokens.module.css';
import OptionsSection from './components/OptionsSection/OptionsSection';
import TokensSection from './components/TokensSection/TokensSection';
import { useNearWalletContext } from '../../lib/useNearWallet';

function TokensPage({}) {
  const wallet = useNearWalletContext();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // const handleSearch = (e) => {
  //   const { value } = e.target;
  //   setSearchText(value);
  // };

  // const handlePage = (page: number) => {
  //   setCurrentPage(page);
  // };

  return (
    <AppConsumer>
      {({ isDarkMode }) => (
        <div>
          {wallet.isConnected() && (
            <div
              className="padding-20-40"
              style={{
                backgroundColor: isDarkMode ? '#282828' : '#f8f8f8',
                color: isDarkMode ? '#ffffff' : undefined
              }}
            >
              <OptionsSection />
            </div>
          )}
          <div
          //  className={
          //   isDarkMode ? styles.tokensSectionDark : styles.tokensSection
          //   }
          >
            <div>
              <TokensSection
                isDarkMode={isDarkMode}
                // contract={contract}
                // lsKey={lsKey}
                // handlePage={handlePage}
                // currentPage={currentPage}
                // lsKeyCachedTokens={lsKeyCachedTokens}
                // accountId={accountId}
                // isSignedIn={signedIn}
                // searchText={searchText}
                // isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      )}
    </AppConsumer>
  );
}

export default TokensPage;
