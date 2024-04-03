import OptionsSection from './components/OptionsSection/OptionsSection';
import TokensSection from './components/TokensSection/TokensSection';

import { AppConsumer } from '../../context/AppContext';

function TokensPage({}) {
  return (
    <AppConsumer>
      {({ isDarkMode }) => (
        <div>
          {/* {wallet.isConnected() && (
            <div
              className="px-2 py-4"
              style={{
                backgroundColor: isDarkMode ? '#282828' : '#f8f8f8',
                color: isDarkMode ? '#ffffff' : undefined
              }}
            >
              <OptionsSection />
            </div>
          )} */}
          <div>
            <div>
              <TokensSection isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      )}
    </AppConsumer>
  );
}

export default TokensPage;
