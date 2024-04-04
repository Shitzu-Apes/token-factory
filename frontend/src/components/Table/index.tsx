import { toTokenAccountId } from '~/lib/constant';
import { TPool } from '~/lib/useTokens';
import { TokenArgs } from '~/pages/components/OptionsSection/OptionsSection';

import { InformationCircleIcon } from '@heroicons/react/20/solid';
import Row from './Row';

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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white flex items-center"
                  >
                    Lock{' '}
                    <a
                      target="_blank"
                      href="https://near.social/slimedragon.near/widget/LockLP"
                      rel="noreferrer"
                    >
                      <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-300" />
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-500 dark:text-white">
                {tokens.map((token) => {
                  return (
                    <Row
                      key={token.metadata.symbol}
                      pool={pools[toTokenAccountId(token.metadata.symbol)]}
                      token={token}
                    />
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
