export const UploadResizeWidth = 96;
export const UploadResizeHeight = 96;

export const MaxU128 = BigInt(2) ** BigInt(128) - BigInt(1);
export const MinAccountIdLen = 2;
export const MaxAccountIdLen = 64;
export const ValidAccountRe = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
export const ValidTokenIdRe = /^[a-z\d]+$/;
export const ContractName = 'tkn.near';
export const THIRTY_TGAS = '30000000000000';
export const NO_DEPOSIT = '0';
export const SimplePool = 'SIMPLE_POOL';
export const RefContractId = 'v2.ref-finance.near';
export const ExplorerBaseUrl = 'https://nearblocks.io';
export const wNEAR = 'wrap.near';

export const RefStorageDeposit = BigInt(250) * BigInt(10) ** BigInt(19) + BigInt(1);
export const StorageDeposit = BigInt(125) * BigInt(10) ** BigInt(19);
export const PoolStorageDeposit = BigInt(500) * BigInt(10) ** BigInt(19);

export const OneNear = BigInt(10) ** BigInt(24);
export const TGas = BigInt(10) ** BigInt(12);
export const BoatOfGas = BigInt(200) * TGas;

export const toTokenAccountId = (tokenId: string) => `${tokenId.toLowerCase()}.${ContractName}`;

export const localStorageKeyCachedTokens = 'tkn.near:v02:cachedTokens';
export const NFT_BASE_URL =
  'https://bafybeifqejvrnlzraceyapuzne6d2cl2s5bolosrufpwp3lw22pqfcafo4.ipfs.nftstorage.link';
