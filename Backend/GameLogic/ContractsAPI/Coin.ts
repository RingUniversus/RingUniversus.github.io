import EventEmitter from "events";
import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  JsonRpcApiProvider,
  JsonRpcSigner,
} from "ethers";
import { coin } from "@ringuniversus/contracts";
import RUCoinABI from "@ringuniversus/contracts/abis/RingUniversusCoin.json";
import { RUCoinFacet } from "@ringuniversus/contracts/typechain/contracts/coin/facets/RUCoinFacet";

/**
 * Roughly contains methods that map 1:1 with functions that live in the contract. Responsible for
 * reading and writing to and from the blockchain.
 *
 * @todo don't inherit from {@link EventEmitter}. instead use {@link Monomitter}
 */
export class CoinAPI extends EventEmitter {
  private static _instance: CoinAPI;

  private readonly walletProvider: Eip1193Provider;
  private readonly ethersProvider: JsonRpcApiProvider;

  private readonly signer: JsonRpcSigner;
  public readonly contract: RUCoinFacet;

  private constructor(
    walletProvider: Eip1193Provider,
    ethersProvider: JsonRpcApiProvider,
    signer: JsonRpcSigner,
    contract: RUCoinFacet
  ) {
    super();
    this.walletProvider = walletProvider;
    this.ethersProvider = ethersProvider;
    this.signer = signer;
    this.contract = contract;
  }

  public static async instance(
    walletProvider: Eip1193Provider
  ): Promise<CoinAPI> {
    if (!this._instance) {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      // The Contract object
      const contract = new Contract(coin.CONTRACT_ADDRESS, RUCoinABI, signer);

      this._instance = new CoinAPI(
        walletProvider,
        ethersProvider,
        signer,
        contract as unknown as RUCoinFacet
      );
    }
    return this._instance;
  }
}
