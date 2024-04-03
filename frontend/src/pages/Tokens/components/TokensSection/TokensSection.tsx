import { useState } from 'react';

import { useNearWalletContext } from '../../../../lib/useNearWallet';
import { useTokens } from '../../../../lib/useTokens';
import Table from '../../../../components/Tokens/Table';
import { toTokenAccountId } from '../../../../lib/constant';
import PaginationBox from '../../../../components/elements/PaginationBox';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/20/solid';

const SortedByLiquidity = 'liquidity';
const SortedByYourTokens = 'your';
const SortedByIndex = 'index';
const rowsPerPage = 50;

function TokensSection({ isDarkMode }: { isDarkMode: boolean }) {
  const wallet = useNearWalletContext();
  const [sortedBy, setSortedBy] = useState(SortedByLiquidity);
  const [searchInput, setSearchInput] = useState('');

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

  const filteredAndSortedTokens = tokens
    .filter((token) => {
      if (!searchInput) return true;
      return (
        token.metadata.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        token.metadata.symbol.toLowerCase().includes(searchInput.toLowerCase())
      );
    })
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
      <div>
        <div>
          <div className="relative mt-2 px-2 rounded-md shadow-sm">
            <input
              type="text"
              name="account-number"
              id="account-number"
              className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Token name or symbol"
              onInput={(e) => {
                setSearchInput(e.currentTarget.value);
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Table tokens={filteredAndSortedTokens} pools={pools} />
      </div>
      <div className="pb-5">
        <PaginationBox
          currentPage={currentPage}
          handlePage={handlePage}
          rowsPerPage={rowsPerPage}
          dataLength={filteredAndSortedTokens.length}
        />
      </div>
    </div>
  );
}

export default TokensSection;
