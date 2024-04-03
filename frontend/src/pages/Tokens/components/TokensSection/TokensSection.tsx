import { useState } from 'react';

// import PaginationBox from '../../../../components/elements/PaginationBox';
// import Table from '../../../../components/elements/Table';
// import DefaultTokenIcon from '../../../../default-token.png';

// import styles from './TokensSection.module.css';
import { useNearWalletContext } from '../../../../lib/useNearWallet';
import { useTokens } from '../../../../lib/useTokens';

const SortedByLiquidity = 'liquidity';
const SortedByYourTokens = 'your';
const SortedByIndex = 'index';
const rowsPerPage = 50;

// const ot = (pool, token) => (token in pool.tokens ? pool.tt[1 - pool.tt.indexOf(token)] : null);

function TokensSection({ isDarkMode }: { isDarkMode: boolean }) {
  const wallet = useNearWalletContext();
  const [sortedBy, setSortedBy] = useState(SortedByLiquidity);

  const { tokens, pools } = useTokens(wallet);

  return (
    <div className={''}>
      <div className={''}>
        <span className={`padding-20-20-0-0 ${isDarkMode && 'color-white'}`}>{'Sort by'}</span>
        <div className="btn-group" role="group" aria-label="Sorted By">
          <button
            type="button"
            className={`btn ${
              sortedBy === SortedByLiquidity ? 'btn-secondary background-color-black' : 'btn'
            }`}
            onClick={() => setSortedBy(SortedByLiquidity)}
          >
            Liquidity
          </button>
          {wallet.accountId && (
            <button
              type="button"
              className={`btn ${
                sortedBy === SortedByYourTokens ? 'btn-secondary background-color-black' : 'btn'
              }`}
              onClick={() => setSortedBy(SortedByYourTokens)}
            >
              Your tokens
            </button>
          )}
          <button
            type="button"
            className={`btn ${
              sortedBy === SortedByIndex ? 'btn-secondary background-color-black' : 'btn'
            }`}
            onClick={() => {
              setSortedBy(SortedByIndex);
            }}
          >
            Index
          </button>
        </div>
      </div>
      <div className={''}>
        <Table columns={columns} data={currentData} isDarkMode={isDarkMode} />
      </div>
      <div className={''}>
        <PaginationBox
          handlePage={this.props.handlePage}
          rowsPerPage={rowsPerPage}
          dataLength={dataFiltered.length}
          currentPage={this.props.currentPage}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default React.memo(TokensSection);
