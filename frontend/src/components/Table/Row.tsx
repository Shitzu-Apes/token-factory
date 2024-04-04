import { ExplorerBaseUrl, toTokenAccountId } from '../../lib/constant';
import { addrsFormatter, bnFormatter, priceFormatter } from '../../lib/formatter';
import { TPool } from '../../lib/useTokens';
import { TokenArgs } from '../../pages/components/OptionsSection/OptionsSection';

import DexScreenerLogo from '../../assets/icons/DexScreener.png';
import RefLogo from '../../assets/icons/ref.png';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';

export default function Row({
  pool,
  token,
  nearUSDCPrice
}: {
  pool: TPool[string] | undefined;
  token: TokenArgs;
  nearUSDCPrice: bigint | null;
}) {
  //   const pool = pools[toTokenAccountId(token.metadata.symbol)];
  if (pool && nearUSDCPrice) {
    console.log(
      token.metadata.symbol,
      Math.floor((Number(token.total_supply) * pool.price) / Number(nearUSDCPrice))
    );
  }

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
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {bnFormatter(token.total_supply.toString(), token.metadata.decimals)}
        </div>
        {pool && (
          <div className="mt-1 text-gray-500 dark:text-gray-300">
            ${' '}
            {bnFormatter(
              Math.floor(
                (Number(token.total_supply) * pool.price) / Number(nearUSDCPrice)
              ).toString(),
              6,
              2,
              2
            )}
          </div>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
        <div className="font-medium text-gray-900 dark:text-white">
          {pool
            ? nearUSDCPrice
              ? `$ ${bnFormatter((pool.liquidity / nearUSDCPrice).toString(), 24 - (24 - 6))}`
              : `Ⓝ ${bnFormatter(pool.liquidity.toString())}`
            : 'Not Found'}
        </div>

        {pool && (
          <div className="flex gap-2 items-center mt-1">
            <a
              href={`https://dexscreener.com/near/refv1-${pool.index}`}
              target="_blank"
              className="text-gray-500 dark:text-gray-300 flex items-center"
            >
              <img src={DexScreenerLogo} className="w-4 h-4" alt="DEXSCREENER" />
            </a>
            <hr className="w-0.5 h-4 bg-gray-500 dark:bg-gray-300" />
            <a
              href={`https://app.ref.finance/pool/${pool.index}`}
              target="_blank"
              className="text-gray-500 dark:text-gray-300 flex items-center"
            >
              <img src={RefLogo} className="w-4 h-4" alt="REF" />
            </a>
          </div>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
        <div className="font-medium text-gray-900 dark:text-white">
          {pool
            ? nearUSDCPrice
              ? `$ ${priceFormatter(
                  pool.price / Number(nearUSDCPrice), // price is in (near / token)
                  token.metadata.decimals + 24 - 6,
                  8,
                  12
                )}`
              : `Ⓝ ${priceFormatter(pool.price, token.metadata.decimals, 8, 12)}`
            : 0}
        </div>
        <a
          href={`https://app.ref.finance/#wrap.near|${toTokenAccountId(token.metadata.symbol)}`}
          target="_blank"
          className="mt-1 text-primary-dark"
        >
          Buy on <img src={RefLogo} className="w-4 h-4 inline" /> Ref
        </a>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
        <div className="flex items-center">
          {pool ? (
            <>
              {(
                (pool.locked.reduce((acc, lock) => acc + Number(lock[1].amount), 0) /
                  Number(pool.shares_total_supply)) *
                100
              ).toFixed(2) + '%'}

              <a
                href={`https://near.social/slimedragon.near/widget/LockLP?poolId=${pool.index}`}
                target="_blank"
                className="ml-1 text-primary-dark"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </>
          ) : (
            '0%'
          )}
        </div>
      </td>
    </tr>
  );
}
