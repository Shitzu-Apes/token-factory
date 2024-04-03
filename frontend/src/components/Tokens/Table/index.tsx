import { ExplorerBaseUrl, toTokenAccountId } from '../../../lib/constant';
import { addrsFormatter, bnFormatter, priceFormatter } from '../../../lib/formatter';
import { TPool } from '../../../lib/useTokens';
import { TokenArgs } from '../../../pages/Tokens/components/OptionsSection/OptionsSection';

import DexScreenerLogo from '../../../assets/icons/DexScreener.png';

export default function Table({ tokens, pools }: { tokens: TokenArgs[]; pools: TPool }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 dark:bg-gray-800">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                  >
                    Token
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Owner
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Total Supply
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Liquidity
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Lock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-500 dark:text-white">
                {tokens.map((token) => {
                  const pool = pools[toTokenAccountId(token.metadata.symbol)];

                  return (
                    <tr key={token.metadata.symbol}>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-0">
                        <a
                          href={`${ExplorerBaseUrl}/token/${toTokenAccountId(token.metadata.symbol)}`}
                          target="_blank"
                        >
                          <div className="flex items-center">
                            <div className="h-11 w-11 flex-shrink-0">
                              <img
                                className="h-11 w-11 rounded-full"
                                src={token.metadata.icon}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {addrsFormatter(token.metadata.name)}
                              </div>
                              <div className="mt-1 text-gray-500 dark:text-gray-300">
                                ${addrsFormatter(token.metadata.symbol)}
                              </div>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                        <a href={`${ExplorerBaseUrl}/address/${token.owner_id}`} target="_blank">
                          <div className="text-gray-900 dark:text-white">
                            {addrsFormatter(token.owner_id)}
                          </div>
                          <div className="mt-1 text-gray-500 dark:text-gray-300">{''}</div>
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                        {bnFormatter(token.total_supply.toString(), token.metadata.decimals)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {pool ? `Ⓝ ${bnFormatter(pool.liquidity.toString())}` : 'Not Found'}
                        </div>

                        {pool && (
                          <a
                            href={`https://dexscreener.com/near/refv1-${pool.index}`}
                            target="_blank"
                            className="mt-1 text-gray-500 dark:text-gray-300 flex items-center"
                          >
                            <img src={DexScreenerLogo} className="w-4 h-4 mr-1" alt="DEXSCREENER" />
                            DEXSCREENER
                          </a>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Ⓝ {pool ? priceFormatter(pool.price, token.metadata.decimals, 8, 12) : 0}
                        </div>
                        <a
                          href={`https://app.ref.finance/#wrap.near|${toTokenAccountId(token.metadata.symbol)}`}
                          target="_blank"
                          className="mt-1 text-primary-dark hover:text-indigo-900"
                        >
                          Buy on Ref
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                        {pool
                          ? (
                              (pool.locked.reduce((acc, lock) => acc + Number(lock[1].amount), 0) /
                                Number(pool.shares_total_supply)) *
                              100
                            ).toFixed(2) + '%'
                          : '0%'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
