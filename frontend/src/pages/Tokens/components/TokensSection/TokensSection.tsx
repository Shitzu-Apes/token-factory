import { useState } from 'react';

import { useNearWalletContext } from '../../../../lib/useNearWallet';
import { useTokens } from '../../../../lib/useTokens';
import Table from '../../../../components/Tokens/Table';
import { toTokenAccountId } from '../../../../lib/constant';
import PaginationBox from '../../../../components/elements/PaginationBox';

const SortedByLiquidity = 'liquidity';
const SortedByYourTokens = 'your';
const SortedByIndex = 'index';
const rowsPerPage = 50;

function TokensSection({ isDarkMode }: { isDarkMode: boolean }) {
  const wallet = useNearWalletContext();
  const [sortedBy, setSortedBy] = useState(SortedByLiquidity);

  const { tokens, pools, tokenIdx } = useTokens(wallet);

  tokens.sort((a, b) => {
    if (sortedBy === SortedByLiquidity) {
      const tokenALiquidity =
        toTokenAccountId(a.metadata.symbol) in pools
          ? pools[toTokenAccountId(a.metadata.symbol)].liquidity
          : BigInt(0);
      const tokenBLiquidity =
        toTokenAccountId(b.metadata.symbol) in pools
          ? pools[toTokenAccountId(b.metadata.symbol)].liquidity
          : BigInt(0);
      return Number(tokenBLiquidity - tokenALiquidity);
    }

    if (sortedBy === SortedByIndex) {
      return tokenIdx[a.metadata.symbol] - tokenIdx[b.metadata.symbol];
    }

    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handlePage = (page: number) => {
    setCurrentPage(page);
  };

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
      <div className="">
        <Table
          tokens={tokens.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
          pools={pools}
        />
      </div>
      <div className="pb-5">
        <PaginationBox
          currentPage={currentPage}
          handlePage={handlePage}
          rowsPerPage={rowsPerPage}
          dataLength={tokens.length}
        />
      </div>
    </div>
  );
}

export default TokensSection;
