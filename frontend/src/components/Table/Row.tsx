import { ExplorerBaseUrl, toTokenAccountId } from '../../lib/constant';
import { addrsFormatter, bnFormatter, priceFormatter } from '../../lib/formatter';
import { TPool } from '../../lib/useTokens';
import { TokenArgs } from '../../pages/components/OptionsSection/OptionsSection';

import DexScreenerLogo from '../../assets/icons/DexScreener.png';

export default function Row({
  pool,
  token
}: {
  pool: TPool[string] | undefined;
  token: TokenArgs;
}) {
  //   const pool = pools[toTokenAccountId(token.metadata.symbol)];

  return (
    <tr key={token.metadata.symbol}>
      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-0">
        <a
          href={`${ExplorerBaseUrl}/token/${toTokenAccountId(token.metadata.symbol)}`}
          target="_blank"
        >
          <div className="flex items-center">
            <div className="h-11 w-11 flex-shrink-0">
              <img className="h-11 w-11 rounded-full" src={token.metadata.icon} alt="" />
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
          <div className="text-gray-900 dark:text-white">{addrsFormatter(token.owner_id)}</div>
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
        {pool ? (
          <a
            href={`https://near.social/slimedragon.near/widget/LockLP?poolId=${pool.index}`}
            target="_blank"
            rel="noreferrer"
          >
            {(
              (pool.locked.reduce((acc, lock) => acc + Number(lock[1].amount), 0) /
                Number(pool.shares_total_supply)) *
              100
            ).toFixed(2) + '%'}
          </a>
        ) : (
          '0%'
        )}
      </td>
    </tr>
  );
}
