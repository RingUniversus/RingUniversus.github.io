import EventEmitter from "events";
import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  JsonRpcApiProvider,
  JsonRpcSigner,
} from "ethers";
import { ring } from "@ringuniversus/contracts";
import RURingABI from "@ringuniversus/contracts/abis/RingUniversusRing.json";
import { RURingFacet } from "@ringuniversus/contracts/typechain/contracts/ring/facets/RURingFacet";

/**
 * Roughly contains methods that map 1:1 with functions that live in the contract. Responsible for
 * reading and writing to and from the blockchain.
 *
 * @todo don't inherit from {@link EventEmitter}. instead use {@link Monomitter}
 */
export class RingAPI extends EventEmitter {
  private static _instance: RingAPI;

  private readonly walletProvider: Eip1193Provider;
  private readonly ethersProvider: JsonRpcApiProvider;

  private readonly signer: JsonRpcSigner;
  public readonly contract: RURingFacet;

  private constructor(
    walletProvider: Eip1193Provider,
    ethersProvider: JsonRpcApiProvider,
    signer: JsonRpcSigner,
    contract: RURingFacet
  ) {
    super();
    this.walletProvider = walletProvider;
    this.ethersProvider = ethersProvider;
    this.signer = signer;
    this.contract = contract;
  }

  // public async playerInfo(address: AddressLike): Promise<InfoStructOutput> {
  //   return await this.contract.playerInfo(address);
  // }

  public static async instance(
    walletProvider: Eip1193Provider
  ): Promise<RingAPI> {
    if (!this._instance) {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      // The Contract object
      const contract = new Contract(ring.CONTRACT_ADDRESS, RURingABI, signer);

      this._instance = new RingAPI(
        walletProvider,
        ethersProvider,
        signer,
        contract as unknown as RURingFacet
      );
    }
    return this._instance;
  }
}
