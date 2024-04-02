import Big from 'big.js';
export const ContractName = 'tkn.near';
export const OneNear = Big(10).pow(24);
const TGas = Big(10).pow(12);
export const BoatOfGas = Big(200).mul(TGas);

export const toTokenAccountId = (tokenId) => `${tokenId.toLowerCase()}.${ContractName}`;
