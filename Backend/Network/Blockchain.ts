// These are loaded as URL paths by a webpack loader
import coinAbi from "@ringuniversus/contracts/abis/RingUniversusCoin.json";
import playerAbi from "@ringuniversus/contracts/abis/RingUniversusPlayer.json";
import {
  createContract,
  createEthConnection,
  EthConnection,
} from "@ringuniversus/network";
import type { Contract, JsonRpcApiProvider, Wallet } from "ethers";

/**
 * Loads the game contract, which is responsible for updating the state of the game.
 */
export async function coinLoader<T extends Contract>(
  address: string,
  provider: JsonRpcApiProvider,
  signer?: Wallet
): Promise<T> {
  return createContract<T>(address, coinAbi, provider, signer);
}
export async function playerLoader<T extends Contract>(
  address: string,
  provider: JsonRpcApiProvider,
  signer?: Wallet
): Promise<T> {
  return createContract<T>(address, playerAbi, provider, signer);
}

export function getEthConnection(): Promise<EthConnection> {
  //   console.log("process.env.NODE_ENV: ", import.meta.env);
  const isProd = import.meta.env.NODE_ENV === "production";
  const defaultUrl = import.meta.env.VITE_DEFAULT_RPC as string;

  let url: string;

  if (isProd) {
    url = defaultUrl;
  } else {
    url = "https://opbnb-testnet-rpc.bnbchain.org";
  }

  console.log(`GAME METADATA:`);
  console.log(`rpc url: ${url}`);
  console.log(`is production: ${isProd}`);
  console.log(`webserver url: ${import.meta.env.DF_WEBSERVER_URL}`);

  return createEthConnection(url);
}
