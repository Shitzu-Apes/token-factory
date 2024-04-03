import React, { useEffect } from 'react';

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

  const { tokens } = useTokens(wallet);

  return <div className={''}>{JSON.stringify(tokens)}</div>;
}

export default React.memo(TokensSection);
