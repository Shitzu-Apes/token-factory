import { useNearWalletContext } from '~/lib/useNearWallet';
import { UserIcon } from '@heroicons/react/20/solid';

export default function TopBar({
  requestSignIn,
  isConnected,
  requestSignOut
}: {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requestSignIn: () => void;
  isConnected: boolean;
  requestSignOut: () => void;
}) {
  const wallet = useNearWalletContext();

  return (
    <div className={`flex px-2 py-2`}>
      <h2 className="ml-2 text-lg dark:text-white">TOKEN FARM by SHITZU</h2>
      <div className="ml-auto pr-5">
        {isConnected ? (
          <div className="flex items-center">
            <div>
              {wallet.shitzuNFT ? (
                <img className="inline-block h-9 w-9 rounded-full" src={wallet.shitzuNFT} alt="" />
              ) : (
                <UserIcon className="h-9 w-9 rounded-full" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900">
                {wallet.accountId}
              </p>
              <div
                className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-100 group-hover:text-gray-700"
                onClick={requestSignOut}
              >
                Log Out
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="cursor-pointer rounded-md bg-primary-dark px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={requestSignIn}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
