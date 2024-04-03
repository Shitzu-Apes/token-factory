import { useState } from 'react';
import ShitzuIcon from '../assets/icons/shitzu.svg';
import ShitzuFace from '../assets/icons/shitzu_face.svg';
import { useNearWalletContext } from '../lib/useNearWallet';

export default function Hero() {
  const wallet = useNearWalletContext();
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="bg-primary-dark relative z-10">
      <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <img src={ShitzuFace} alt="hero-bg" className="w-full h-full object-contain" />
      </div>
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8 relative z-30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Deploy Your Own Token.
            <br />
            And Join Us SHITZURIAN.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white">
            This is a forked version of the original{' '}
            <a href="tkn.farm" target="_blank" rel="noreferrer">
              tkn.farm
            </a>{' '}
            project. presented by{' '}
            <a
              href="https://shitzuapes.xyz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center"
            >
              <img
                src={ShitzuIcon}
                alt={'ShitzuIcon'}
                width="40"
                height="40"
                className="w-10 h-10 mr-2"
              />
              <div>Shitzu</div>
            </a>
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <div
              className={`
              ${wallet.shitzuNFT ? 'cursor-pointer' : 'cursor-not-allowed'}
              rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-dark shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
              `}
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Deploy New Token
            </div>
            <a href="#" className="text-sm font-semibold leading-6 text-white">
              Buy Shitzu NFT <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
