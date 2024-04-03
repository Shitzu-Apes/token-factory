export const ContractName = 'tkn.near';
export const OneNear = BigInt(10) ** BigInt(24);
const TGas = BigInt(10) ** BigInt(12);
export const BoatOfGas = BigInt(200) * TGas;

export const toTokenAccountId = (tokenId: string) => `${tokenId.toLowerCase()}.${ContractName}`;
