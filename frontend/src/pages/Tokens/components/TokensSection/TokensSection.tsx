import { useMemo, useState } from 'react';

import { useNearWalletContext } from '../../../../lib/useNearWallet';
import { useTokens } from '../../../../lib/useTokens';
import Table from '../../../../components/Tokens/Table';
import { toTokenAccountId } from '../../../../lib/constant';
import PaginationBox from '../../../../components/elements/PaginationBox';
import { FunnelIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/20/solid';

const SortedByLiquidity = 'liquidity';
const SortedByLocked = 'lock';
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

    if (sortedBy === SortedByLocked) {
      const tokenALocked =
        toTokenAccountId(a.metadata.symbol) in pools
          ? pools[toTokenAccountId(a.metadata.symbol)].locked.reduce(
              (acc, [_, { amount }]) => acc + Number(amount),
              0
            ) / Number(pools[toTokenAccountId(a.metadata.symbol)].shares_total_supply)
          : 0;
      const tokenBLocked =
        toTokenAccountId(b.metadata.symbol) in pools
          ? pools[toTokenAccountId(b.metadata.symbol)].locked.reduce(
              (acc, [_, { amount }]) => acc + Number(amount),
              0
            ) / Number(pools[toTokenAccountId(b.metadata.symbol)].shares_total_supply)
          : 0;
      return Number(tokenBLocked - tokenALocked);
    }

    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handlePage = (page: number) => {
    setCurrentPage(page);
  };

  const filteredAndSortedTokens = useMemo(
    () =>
      tokens.filter((token) => {
        if (!searchInput) return true;
        return (
          token.metadata.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          token.metadata.symbol.toLowerCase().includes(searchInput.toLowerCase())
        );
      }),
    [tokens, searchInput, currentPage, sortedBy]
  );

  return (
    <div className={''}>
      <div className="flex justify-between items-center px-6 lg:px-8 pt-4">
        <div className="flex w-[400px]">
          <div className="relative w-full flex">
            <div className="bg-primary-dark flex justify-center items-center h-10 w-10 rounded-l-lg">
              <MagnifyingGlassCircleIcon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="account-number"
              id="account-number"
              className="block w-full rounded-r-lg pl-3 border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
              placeholder="Token name or symbol"
              onInput={(e) => {
                setSearchInput(e.currentTarget.value);
              }}
            />
          </div>
        </div>
        <div className={'flex flex-1 items-center justify-center'}>
          <div className="ml-auto">
            <div>
              <div className="sm:block">
                <nav
                  className="isolate flex divide-x divide-gray-200 min-w-[400px] w-full"
                  aria-label="Tabs"
                >
                  <div className="bg-primary-dark flex items-center justify-center h-10 w-10 rounded-l-lg">
                    <FunnelIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div
                    className={`
                    ${sortedBy === SortedByLiquidity ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                    border border-primary-dark cursor-pointer
                    w-[33%] group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}
                    onClick={() => setSortedBy(SortedByLiquidity)}
                  >
                    <span>Liquidity</span>
                    <span
                      aria-hidden="true"
                      className={`
                      ${sortedBy === SortedByLiquidity ? 'bg-primary-dark' : 'bg-transparent'}
                      absolute inset-x-0 bottom-0 h-0.5`}
                    />
                  </div>
                  <div
                    className={`
                    ${sortedBy === SortedByLocked ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                    border border-primary-dark cursor-pointer
                    w-[33%] group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}
                    onClick={() => setSortedBy(SortedByLocked)}
                  >
                    <span>Locked</span>
                    <span
                      aria-hidden="true"
                      className={`
                      ${sortedBy === SortedByLocked ? 'bg-primary-dark' : 'bg-transparent'}
                      absolute inset-x-0 bottom-0 h-0.5`}
                    />
                  </div>
                  <div
                    className={`
                    ${sortedBy === SortedByIndex ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                    border border-primary-dark cursor-pointer
                    w-[33%]  rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}
                    onClick={() => setSortedBy(SortedByIndex)}
                  >
                    <span>Index</span>
                    <span
                      aria-hidden="true"
                      className={`
                      ${sortedBy === SortedByIndex ? 'bg-primary-dark' : 'bg-transparent'}
                      absolute inset-x-0 bottom-0 h-0.5`}
                    />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <Table
          tokens={filteredAndSortedTokens.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
          )}
          pools={pools}
        />
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
