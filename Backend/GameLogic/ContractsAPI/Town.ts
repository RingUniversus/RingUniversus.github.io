import EventEmitter from "events";
import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  JsonRpcApiProvider,
  JsonRpcSigner,
} from "ethers";
import { town } from "@ringuniversus/contracts";
import RUTownABI from "@ringuniversus/contracts/abis/RingUniversusTown.json";
import { RUTownFacet } from "@ringuniversus/contracts/typechain/contracts/town/facets/RUTownFacet";

/**
 * Roughly contains methods that map 1:1 with functions that live in the contract. Responsible for
 * reading and writing to and from the blockchain.
 *
 * @todo don't inherit from {@link EventEmitter}. instead use {@link Monomitter}
 */
export class TownAPI extends EventEmitter {
  private static _instance: TownAPI;

  private readonly walletProvider: Eip1193Provider;
  private readonly ethersProvider: JsonRpcApiProvider;

  private readonly signer: JsonRpcSigner;
  public readonly contract: RUTownFacet;

  private constructor(
    walletProvider: Eip1193Provider,
    ethersProvider: JsonRpcApiProvider,
    signer: JsonRpcSigner,
    contract: RUTownFacet
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
  ): Promise<TownAPI> {
    if (!this._instance) {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      // The Contract object
      const contract = new Contract(town.CONTRACT_ADDRESS, RUTownABI, signer);

      this._instance = new TownAPI(
        walletProvider,
        ethersProvider,
        signer,
        contract as unknown as RUTownFacet
      );
    }
    return this._instance;
  }
}
