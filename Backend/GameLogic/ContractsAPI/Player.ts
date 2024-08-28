import EventEmitter from "events";
import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  JsonRpcApiProvider,
  JsonRpcSigner,
} from "ethers";
import { player } from "@ringuniversus/contracts";
import RUPlayerABI from "@ringuniversus/contracts/abis/RingUniversusPlayer.json";
import facets from "@ringuniversus/contracts/typechain/contracts/player/facets";
// import { wsProvider } from "./wsProvider";

/**
 * Roughly contains methods that map 1:1 with functions that live in the contract. Responsible for
 * reading and writing to and from the blockchain.
 *
 * @todo don't inherit from {@link EventEmitter}. instead use {@link Monomitter}
 */
export class PlayerAPI extends EventEmitter {
  private static _instance: PlayerAPI;

  private readonly walletProvider: Eip1193Provider;
  private readonly ethersProvider: JsonRpcApiProvider;

  private readonly signer: JsonRpcSigner;
  public readonly contract: facets.RUPlayerFacet;
  // public readonly events: facets.RUPlayerFacet;

  private constructor(
    walletProvider: Eip1193Provider,
    ethersProvider: JsonRpcApiProvider,
    signer: JsonRpcSigner,
    contract: facets.RUPlayerFacet
  ) {
    super();
    this.walletProvider = walletProvider;
    this.ethersProvider = ethersProvider;
    this.signer = signer;
    this.contract = contract;
  }

  public static async instance(
    walletProvider: Eip1193Provider
  ): Promise<PlayerAPI> {
    if (!this._instance) {
      const ethersProvider = new BrowserProvider(walletProvider, undefined, {
        polling: true,
        pollingInterval: 2000,
      });
      const signer = await ethersProvider.getSigner();
      // The Contract object
      const contract = new Contract(
        player.CONTRACT_ADDRESS,
        RUPlayerABI,
        signer
      );
      // const events = new Contract(
      //   player.CONTRACT_ADDRESS,
      //   RUPlayerABI,
      //   wsProvider
      // );

      this._instance = new PlayerAPI(
        walletProvider,
        ethersProvider,
        signer,
        contract as any as facets.RUPlayerFacet
      );
    }
    return this._instance;
  }

  public destroy(): void {
    this.removeAllListeners();
  }
}
