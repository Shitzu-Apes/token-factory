import Big from 'big.js';
import * as ls from 'local-storage';
import * as nearAPI from 'near-api-js';
import React from 'react';
import BTable from 'react-bootstrap/Table';
import { useTable } from 'react-table';

import DefaultTokenIcon from './default-token.png';

export const ContractName = 'tkn.near';
const SimplePool = 'SIMPLE_POOL';
const RefContractId = 'v2.ref-finance.near';
const ExplorerBaseUrl = 'https://explorer.near.org';
const wNEAR = 'wrap.near';
export const OneNear = Big(10).pow(24);
const TGas = Big(10).pow(12);
export const BoatOfGas = Big(200).mul(TGas);
const RefStorageDeposit = Big(250).mul(Big(10).pow(19)).add(1);
const StorageDeposit = Big(125).mul(Big(10).pow(19));
const PoolStorageDeposit = Big(500).mul(Big(10).pow(19));

const SortedByLiquidity = 'liquidity';
const SortedByYourTokens = 'your';
const SortedByIndex = 'index';

const ot = (pool, token) => (token in pool.tokens ? pool.tt[1 - pool.tt.indexOf(token)] : null);

export const toTokenAccountId = (tokenId) => `${tokenId.toLowerCase()}.${ContractName}`;

function Table({ columns, data }) {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  return (
    <BTable striped bordered hover {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr key={index} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => (
              <th key={index} {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr key={index} {...row.getRowProps()}>
              {row.cells.map((cell, index) => {
                return (
                  <td key={index} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </BTable>
  );
}

export class Tokens extends React.Component {
  constructor(props) {
    super(props);
    this.tokens = ls.get(props.lsKeyCachedTokens) || [];
    this.lsKey = props.lsKey;
    this.lsKeySortedBy = this.lsKey + 'sortedBy';
    this.balances = {};
    this.formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short'
    });

    this.state = {
      tokens: [...this.tokens],
      prices: {},
      liquidity: {},
      bestPool: {},
      sortedBy: ls.get(this.lsKeySortedBy) || SortedByLiquidity
    };
    this.columns = [
      {
        Header: 'Icon',
        accessor: 'icon',
        Cell: ({ row }) => (
          <img
            className="rounded token-icon"
            src={row.original.metadata.icon || DefaultTokenIcon}
            alt="Icon"
          />
        )
      },
      {
        Header: 'Symbol',
        accessor: 'token_id',
        Cell: ({ row }) => {
          const { symbol } = row.original.metadata;
          return (
            <a
              target="_blank"
              href={`${ExplorerBaseUrl}/accounts/${symbol.toLowerCase()}.${ContractName}`}
              rel="noreferrer"
            >
              {symbol.length > 15 ? `${symbol.substring(0, 4)}...${symbol.substr(-2)}` : symbol}
            </a>
          );
        }
      },
      {
        Header: () => <span style={{ whiteSpace: 'nowrap' }}>Token Name</span>,
        accessor: 'name',
        Cell: ({ row }) => {
          const { name } = row.original.metadata;
          if (name.length > 20) {
            return name.substring(0, 20) + '...';
          }
          return name;
        }
      },
      {
        Header: 'Owner ID',
        accessor: 'owner_id',
        Cell: ({ row }) => {
          const { owner_id } = row.original;
          return (
            <a target="_blank" href={`${ExplorerBaseUrl}/accounts/${owner_id}`} rel="noreferrer">
              {owner_id.length > 20
                ? `${owner_id.substring(0, 6)}...${owner_id.substr(-4)}`
                : owner_id}
            </a>
          );
        }
      },
      {
        Header: 'Total Supply',
        accessor: 'total_supply',
        Cell: ({ row }) => {
          const total_supply = Big(row.original.total_supply)
            .div(Big(10).pow(row.original.metadata.decimals))
            .round(0, 0);
          if (total_supply.gt(Big(10).pow(24))) {
            return 'way too much';
          }
          return this.formatter.format(total_supply.toFixed(0));
        }
      },
      {
        Header: 'Ref Finance',
        accessor: 'REF',
        Cell: ({ row }) => {
          const { symbol, decimals } = row.original.metadata;
          const liq = this.poolLiquidity(symbol);
          const bestPool = this.state.bestPool[toTokenAccountId(symbol)];
          const price = this.tokenPrice(symbol);

          return (
            <div>
              {this.poolExists(symbol) && (
                <div>
                  <a
                    className="btn btn-outline-success"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://app.ref.finance/#wrap.near|${toTokenAccountId(symbol)}`}
                  >
                    Buy <b>{symbol}</b>
                  </a>
                </div>
              )}
              {liq.gt(0) ? (
                <div>
                  <span className="text-muted">Liquidity</span> {liq.div(OneNear).toFixed(3)}{' '}
                  <b>wNEAR</b>
                </div>
              ) : (
                !!props.accountId &&
                (bestPool ? (
                  <a
                    className="btn btn-outline-success"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://app.ref.finance/pool/${bestPool.index}`}
                  >
                    Add Liquidity
                  </a>
                ) : (
                  this.renderListingToken(row.original)
                ))
              )}
              {!!price && (
                <div>
                  <span className="text-muted">Price</span>{' '}
                  {price.div(Big(10).pow(decimals)).toFixed(3)} <b>{symbol}</b>
                </div>
              )}
            </div>
          );
        }
      },
      {
        Header: 'Wallet',
        accessor: 'wallet',
        Cell: ({ row }) =>
          props.accountId && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => this.registerToken(row.original.metadata.symbol)}
            >
              Add to Wallet
            </button>
          )
      }
    ];
    this._initialized = false;
  }

  async refRegisterToken(tokenId) {
    const tokenAccountId = toTokenAccountId(tokenId);
    await this._refContract.account.signAndSendTransaction(RefContractId, [
      nearAPI.transactions.functionCall(
        'storage_deposit',
        {
          account_id: this._accountId,
          registration_only: false
        },
        TGas.mul(5).toFixed(0),
        RefStorageDeposit.toFixed(0)
      ),
      nearAPI.transactions.functionCall(
        'register_tokens',
        {
          token_ids: [tokenAccountId]
        },
        TGas.mul(5).toFixed(0),
        0
      )
    ]);
  }

  async registerToken(tokenId) {
    const tokenContractId = toTokenAccountId(tokenId);
    const tokenContract = new nearAPI.Contract(this._account, tokenContractId, {
      changeMethods: ['storage_deposit']
    });
    await tokenContract.storage_deposit(
      {
        registration_only: true
      },
      BoatOfGas.toFixed(0),
      StorageDeposit.toFixed(0)
    );
  }

  async refDepositToken(tokenAccountId) {
    const tokenContract = new nearAPI.Contract(this._account, tokenAccountId, {
      viewMethods: ['ft_balance_of']
    });
    const amount = await tokenContract.ft_balance_of({
      account_id: this._accountId
    });
    await this._account.signAndSendTransaction(tokenAccountId, [
      nearAPI.transactions.functionCall(
        'storage_deposit',
        {
          account_id: RefContractId,
          registration_only: true
        },
        TGas.mul(5).toFixed(0),
        StorageDeposit.toFixed(0)
      ),
      nearAPI.transactions.functionCall(
        'ft_transfer_call',
        {
          receiver_id: RefContractId,
          amount,
          msg: ''
        },
        TGas.mul(100).toFixed(0),
        '1'
      )
    ]);
  }

  async addSimplePool(tokenAccountId) {
    await this._refContract.add_simple_pool(
      {
        tokens: [wNEAR, tokenAccountId],
        fee: 25
      },
      TGas.mul(30).toFixed(0),
      PoolStorageDeposit.toFixed(0)
    );
  }

  renderListingToken(token) {
    const tokenId = token.metadata.symbol;
    const tokenAccountId = toTokenAccountId(tokenId);
    if (!this._refContract) {
      return false;
    }
    if (!(tokenAccountId in this.balances)) {
      return (
        <button
          className="btn btn-outline-secondary"
          onClick={() => this.refRegisterToken(tokenId)}
        >
          Register <b>{tokenId}</b>
        </button>
      );
    }
    if (this.balances[tokenAccountId].eq(0)) {
      return (
        <button
          className="btn btn-outline-success"
          onClick={() => this.refDepositToken(tokenAccountId)}
        >
          Deposit <b>{tokenId}</b>
        </button>
      );
    }

    return (
      <button
        className="btn btn-outline-success"
        onClick={() => this.addSimplePool(tokenAccountId)}
      >
        Create <b>{tokenId}</b> pool
      </button>
    );
  }

  _init() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    this._account = this.props.contract.account;
    this._accountId = this._account.accountId;
    this._refContract = new nearAPI.Contract(this._account, RefContractId, {
      viewMethods: [
        'get_number_of_pools',
        'get_whitelisted_tokens',
        'storage_balance_of',
        'get_deposits',
        'get_pool',
        'get_pools',
        'get_pool_volumes',
        'get_pool_shares',
        'get_return',
        'get_owner'
      ],
      changeMethods: [
        'add_simple_pool',
        'storage_deposit',
        'register_tokens',
        'add_liquidity',
        'remove_liquidity',
        'swap',
        'withdraw'
      ]
    });

    this.refetchTokens();
    this.refreshRef();
  }

  poolExists(tokenId) {
    return toTokenAccountId(tokenId) in this.state.prices;
  }

  tokenPrice(tokenId) {
    return this.state.prices[toTokenAccountId(tokenId)];
  }

  poolLiquidity(tokenId) {
    return this.state.liquidity[toTokenAccountId(tokenId)] || Big(0);
  }

  sortTokens(tokens) {
    if (this.state.sortedBy === SortedByLiquidity) {
      tokens.sort((a, b) => {
        const liqA = this.poolLiquidity(a.metadata.symbol);
        const liqB = this.poolLiquidity(b.metadata.symbol);
        return liqB.sub(liqA).toNumber();
      });
    } else if (this.state.sortedBy === SortedByYourTokens) {
      tokens.sort((a, b) => {
        const va = a.owner_id === this._accountId ? 1 : 0;
        const vb = b.owner_id === this._accountId ? 1 : 0;
        return vb - va;
      });
    }
    return tokens;
  }

  async refetchTokens() {
    const contract = this.props.contract;
    const numTokens = await contract.get_number_of_tokens();
    const tokens = this.tokens;
    const limit = 100;
    for (let i = tokens.length; i < numTokens; i += limit) {
      const newTokens = await contract.get_tokens({ from_index: i, limit });
      tokens.push(...newTokens);
      ls.set(this.props.lsKeyCachedTokens, tokens);
      this.updateTokens();
    }
  }

  updateTokens() {
    this.setState({
      tokens: this.sortTokens([...(ls.get(this.props.lsKeyCachedTokens) || [])])
    });
    ls.set(this.lsKeySortedBy, this.state.sortedBy);
  }

  async refreshRefBalances() {
    if (this._accountId) {
      const balances = await this._refContract.get_deposits({ account_id: this._accountId });
      Object.keys(balances).forEach((key) => {
        balances[key] = Big(balances[key]);
      });
      this.balances = balances;
    } else {
      this.balances = {};
    }
  }

  async refreshRef() {
    await Promise.all([this.refreshRefPools(), this.refreshRefBalances()]);

    this.setState(
      {
        prices: this.ref.prices,
        liquidity: this.ref.liquidity,
        bestPool: this.ref.bestPool,
        balances: this.balances
      },
      () => this.updateTokens()
    );
  }

  async refreshRefPools() {
    const numPools = await this._refContract.get_number_of_pools();
    const limit = 1_000;
    let rawPools = [];
    for (let i = 0; i < numPools; i += limit) {
      const nextPools = await this._refContract.get_pools({ from_index: i, limit });
      if (nextPools.length === 0) break;
      rawPools = rawPools.concat(nextPools);
    }
    const pools = {};
    rawPools.forEach((pool, i) => {
      if (pool.pool_kind === SimplePool) {
        const tt = pool.token_account_ids;
        const p = {
          index: i,
          tt,
          tokens: tt.reduce((acc, token, tokenIndex) => {
            acc[token] = Big(pool.amounts[tokenIndex]);
            return acc;
          }, {}),
          fee: pool.total_fee,
          shares: Big(pool.shares_total_supply)
        };
        pools[p.index] = p;
      }
    });
    this.ref = {
      pools
    };

    const liquidity = {};

    const prices = {
      [wNEAR]: OneNear
    };

    const bestPool = {};

    console.log('pools', pools);
    Object.values(pools).forEach((pool) => {
      if (wNEAR in pool.tokens) {
        const wNearAmount = pool.tokens[wNEAR];
        pool.otherToken = ot(pool, wNEAR);

        if (!(pool.otherToken in bestPool) || bestPool[pool.otherToken].liquidity.lt(wNearAmount)) {
          bestPool[pool.otherToken] = {
            liquidity: wNearAmount,
            index: pool.index
          };
        }
        if (wNearAmount.lt(OneNear)) {
          return;
        }
        liquidity[pool.otherToken] = (liquidity[pool.otherToken] || Big(0)).add(wNearAmount);
        pool.price = pool.tokens[pool.otherToken].mul(OneNear).div(pool.tokens[wNEAR]);
        if (!(pool.otherToken in prices) || prices[pool.otherToken].gt(pool.price)) {
          prices[pool.otherToken] = pool.price;
        }
      }
    });
    this.ref.prices = prices;
    this.ref.liquidity = liquidity;
    this.ref.bestPool = bestPool;
    console.log('liquidity', liquidity);
  }

  componentDidMount() {
    if (this.props.contract) {
      this._init();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.contract) {
      this._init();
    }
  }

  render() {
    const columns = this.columns;
    const data = this.state.tokens;
    return (
      <div>
        <div className="mb-3">
          Sort by
          <div className="btn-group ml-2" role="group" aria-label="Sorted By">
            <button
              type="button"
              className={`btn ${this.state.sortedBy === SortedByLiquidity ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() =>
                this.setState({ sortedBy: SortedByLiquidity }, () => this.updateTokens())
              }
            >
              Liquidity
            </button>
            <button
              type="button"
              className={`btn ${this.state.sortedBy === SortedByYourTokens ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() =>
                this.setState({ sortedBy: SortedByYourTokens }, () => this.updateTokens())
              }
            >
              Your tokens
            </button>
            <button
              type="button"
              className={`btn ${this.state.sortedBy === SortedByIndex ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => this.setState({ sortedBy: SortedByIndex }, () => this.updateTokens())}
            >
              Index
            </button>
          </div>
        </div>
        <div className="tokens-table">
          <Table columns={columns} data={data} />
        </div>
      </div>
    );
  }
}
