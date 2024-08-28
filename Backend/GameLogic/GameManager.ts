import { EventEmitter } from "events";
import { TerminalHandle } from "../../Frontend/Views/Terminal";
import { GameObjects } from "./GameObjects";
import { PlayerAPI, CoinAPI, RingAPI } from "./ContractsAPI";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { AddressLike } from "ethers";
import { WorldCoords } from "../../_types/ringuniversus/ContractsAPITypes";
import GameEmitter, {
  GameEmitterEvent,
} from "../../Frontend/Utils/GameEmitter";
import { TownAPI } from "./ContractsAPI/Town";
import { GameConstantsStruct } from "@ringuniversus/contracts/typechain/contracts/player/facets/RUPlayerFacet";
import PlayerAPITypes from "../../_types/ringuniversus/PlayerAPITypes";
import { BigNumberish } from "ethers";

export enum GameManagerEvent {
  PlanetUpdate = "PlanetUpdate",
  DiscoveredNewChunk = "DiscoveredNewChunk",
  InitializedPlayer = "InitializedPlayer",
  InitializedPlayerError = "InitializedPlayerError",
  ArtifactUpdate = "ArtifactUpdate",
  Moved = "Moved",
}

class GameManager extends EventEmitter {
  private playerAPI!: PlayerAPI;
  private ringAPI!: RingAPI;
  private coinAPI!: CoinAPI;
  private townAPI!: TownAPI;
  private account: AddressLike;
  private players: Map<AddressLike, object>;
  /**
   * This variable contains the internal state of objects that live in the game world.
   */
  private readonly entityStore: GameObjects;

  private readonly terminal: React.MutableRefObject<TerminalHandle | undefined>;
  private readonly gameEmitter: GameEmitter;
  townInterval: NodeJS.Timer;
  playerInterval: NodeJS.Timer;

  private constructor(
    terminal: React.MutableRefObject<TerminalHandle | undefined>,
    account: AddressLike,
    players: Map<AddressLike, object>,
    playerAPI: PlayerAPI,
    ringAPI: RingAPI,
    coinAPI: CoinAPI,
    townAPI: TownAPI
  ) {
    super();

    this.terminal = terminal;
    this.account = account;
    this.players = players;
    this.playerAPI = playerAPI;
    this.ringAPI = ringAPI;
    this.coinAPI = coinAPI;
    this.townAPI = townAPI;

    this.gameEmitter = GameEmitter.getInstance();
    // this.account = account;
    // this.players = players;
    // this.worldRadius = worldRadius;
    // this.networkHealth$ = monomitter(true);
    // this.paused$ = monomitter(true);
    // this.playersUpdated$ = monomitter();

    this.entityStore = new GameObjects();

    // this.contractsAPI = contractsAPI;
    // this.persistentChunkStore = persistentChunkStore;
    // this.snarkHelper = snarkHelper;
    // this.useMockHash = useMockHash;
    // this.paused = paused;

    // this.ethConnection = ethConnection;

    // this.diagnosticsInterval = setInterval(
    //   this.uploadDiagnostics.bind(this),
    //   10_000
    // );
    // this.scoreboardInterval = setInterval(
    //   this.refreshScoreboard.bind(this),
    //   10_000
    // );
    // this.networkHealthInterval = setInterval(
    //   this.refreshNetworkHealth.bind(this),
    //   10_000
    // );

    // this.playerInterval = setInterval(() => {
    //   if (this.account) {
    //     this.hardRefreshPlayer(this.account);
    //   }
    // }, 5000);

    this.townInterval = setInterval(() => {
      if (this.account) {
        this.hardRefreshTownInfo();
      }
    }, 10_000);
    this.playerInterval = setInterval(() => {
      if (this.account) {
        this.hardRefreshPlayer(this.account);
      }
    }, 5_000);

    // this.settingsSubscription = settingChanged$.subscribe(
    //   (setting: Setting) => {
    //     if (setting === Setting.MiningCores) {
    //       if (this.minerManager) {
    //         const config = {
    //           contractAddress: this.getContractAddress(),
    //           account: this.account,
    //         };
    //         const cores = getNumberSetting(config, Setting.MiningCores);
    //         this.minerManager.setCores(cores);
    //       }
    //     }
    //   }
    // );

    // this.refreshScoreboard();
    // this.refreshNetworkHealth();
    // this.getSpaceships();

    // this.safeMode = false;
  }

  static async create({
    terminal,
    walletProvider,
  }: {
    terminal: React.MutableRefObject<TerminalHandle | undefined>;
    walletProvider: Eip1193Provider | undefined;
  }): Promise<GameManager> {
    if (!terminal.current || !walletProvider) {
      throw new Error("you must pass in a handle to a terminal or provider.");
    }

    const playerAPI = await PlayerAPI.instance(walletProvider);
    const ringAPI = await RingAPI.instance(walletProvider);
    const coinAPI = await CoinAPI.instance(walletProvider);
    const townAPI = await TownAPI.instance(walletProvider);

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const account = signer.address;
    console.log("account: ", account);

    if (!account) {
      throw new Error("no account on eth connection");
    }
    terminal.current?.println("Downloading data from blockchain...");
    terminal.current?.println(
      "(the contract is very big. this may take a while)"
    );

    // const gameStateDownloader = new InitialGameStateDownloader(
    //   terminal.current
    // );
    // const contractsAPI = await makeContractsAPI({
    //   connection,
    //   contractAddress,
    // });

    // const ringNextId = await ringAPI.contract.getNextRingId();
    // console.log("ringNextId: ", ringNextId);

    // console.log(
    //   "getGameConstants: ",
    //   (await playerAPI.contract.getGameConstants()) as GameConstantsStruct
    // );

    const watchedPlayers = new Array();
    watchedPlayers.push(account);
    const players = new Map<AddressLike, object>();
    watchedPlayers.forEach(async (playerAddress) => {
      const t = await playerAPI.contract.playerInfo(playerAddress);
      const mi = await playerAPI.contract.currentMoveInfo(playerAddress);
      players.set(playerAddress, { info: t, moveInfo: mi });
    });

    const gameManager = new GameManager(
      terminal,
      account,
      players,
      playerAPI,
      ringAPI,
      coinAPI,
      townAPI
    );

    // terminal.current?.println("Loading game data from disk...");

    // const persistentChunkStore = await PersistentChunkStore.create({
    //   account,
    //   contractAddress,
    // });

    terminal.current?.newline();
    await gameManager.hardRefreshRingInfo();
    await gameManager.hardRefreshTownInfo();

    playerAPI.contract.on(
      playerAPI.contract.filters.PlayerMoved,
      async (
        player: AddressLike,
        target: WorldCoords,
        distance: number,
        spendTime: number,
        speed: number,
        timestamp: number
      ) => {
        console.log(
          " > Event PlayerMoved: ",
          player,
          target,
          distance,
          spendTime,
          speed,
          timestamp
        );
        await gameManager.hardRefreshPlayer(player, true);
      }
    );
    playerAPI.contract.on(
      playerAPI.contract.filters.MoveStopped,
      async (
        player: string,
        startCoords: WorldCoords,
        endCoords: WorldCoords,
        timestamp: number,
        claimable: boolean
      ) => {
        console.log(player, account);
        if (player !== account) return;
        console.log(
          " > Event MoveStopped: ",
          player,
          startCoords,
          endCoords,
          timestamp,
          claimable
        );
        await gameManager.hardRefreshPlayer(player, true);
      }
    );

    // playerAPI.contract.on("PlayerMoved", async (data) => {
    //   console.log("*", data);
    //   // await gameManager.hardRefreshPlayer(player, true);
    // });

    return gameManager;
  }

  /**
   * Gets the address of the player logged into this game manager.
   */
  public getAccount(): AddressLike | undefined {
    return this.account;
  }

  /** My Own */
  public destroy(): void {
    this.playerAPI.destroy();
  }

  /**
   * Helpful for listening to user input events.
   */
  public getGameEventEmitter() {
    return this.gameEmitter;
  }

  public async tokenAllowance() {
    return await this.coinAPI.contract.allowance(
      this.account,
      await this.playerAPI.contract.getAddress()
    );
  }

  public async tokenApprove() {
    console.log("Approve token...");
    try {
      const tRes = await this.coinAPI.contract.approve(
        await this.playerAPI.contract.getAddress(),
        0xf
      );
      console.log("Transaction response: ", tRes);
      return tRes;
    } catch (reason) {
      console.log("Catch reason: ", reason);
    }
  }

  /**
   * getRingInfo
   */
  public async hardRefreshRingInfo() {
    const ringNextId = await this.ringAPI.contract.getNextRingId();
    const ringContants = await this.ringAPI.contract.getGameConstants();
    // Get one more ring info for renderer
    for (let i = 0; i <= ringNextId; i++) {
      const t = await this.ringAPI.contract.metadata(i);
      this.entityStore.replaceRingInfoFromContractData(
        i,
        t,
        ringNextId,
        ringContants
      );
      console.log(`Ring ID: ${i}, Ring Info: ${t}`);
    }

    return ringNextId;
  }

  /**
   * getTownInfo
   */
  public async hardRefreshTownInfo() {
    const currentTownCount = this.getTownInfo().size;
    const totalSupply = Number(await this.townAPI.contract.totalSupply());
    console.log("Town count compare:", currentTownCount, totalSupply);
    // const ringContants = await this.townAPI.contract.getGameConstants();
    // Get one more town info for renderer
    if (currentTownCount !== totalSupply) {
      for (let i = currentTownCount; i < totalSupply; i++) {
        const t = await this.townAPI.contract.metadata(i);
        this.entityStore.replaceTownInfoFromContractData(i, t);
        console.log(`Town ID: ${i}, Town Info: ${t}`);
      }

      this.gameEmitter.emit(GameEmitterEvent.TownUpdated, totalSupply);
    }

    return totalSupply;
  }

  public getPlayer(address?: AddressLike) {
    let playerInfo;
    if (!address) {
      address = this.account;
    }
    playerInfo = this.players.get(address);
    playerInfo = PlayerAPITypes.transformPlayerInfo(playerInfo);
    playerInfo["isCurrentPlayer"] = this.account === address;
    // console.log("PlayerAPITypes.transform: ", playerInfo);
    return playerInfo;
  }

  private async hardRefreshPlayer(address: AddressLike, exists?: boolean) {
    if ((exists && this.playerExists(address)) || !exists) {
      const t = await this.playerAPI.contract.playerInfo(address);
      const mi = await this.playerAPI.contract.currentMoveInfo(address);
      this.players.set(address, { info: t, moveInfo: mi });

      this.gameEmitter.emit(
        GameEmitterEvent.PlayerUpdated,
        address,
        this.account == this.account
      );
    }
  }

  private playerExists(address: AddressLike) {
    return this.players.has(address);
  }

  /**
   * playerMoveToTarget
   */
  public async playerMoveToTarget(x: number, y: number) {
    try {
      // Coords 1.2312 need process to 123
      // console.log({
      //   x: (x * 100).toFixed(),
      //   y: (y * 100).toFixed(),
      // });
      const tRes = await this.playerAPI.contract.move({
        x: (x * 100).toFixed(),
        y: (y * 100).toFixed(),
      });
      console.log("Transaction response: ", tRes);
      return tRes;
    } catch (reason) {
      console.log("Catch reason: ", reason);
    }
  }

  /**
   * playerStopMoving and wait vrf
   */
  public async playerStopMoving() {
    const tRes = await this.playerAPI.contract.stopAndRequestRandomWords();
    console.log("Transaction response: ", tRes);
    return tRes;
  }

  public async playerClaimRewards() {
    const tRes = await this.playerAPI.contract.claim();
    console.log("Transaction response: ", tRes);
    return tRes;
  }

  public async teleportToTown(ttype: BigNumberish, tId: BigNumberish) {
    const tRes = await this.playerAPI.contract.teleport(ttype, tId);
    console.log("Transaction response: ", tRes);
    return tRes;
  }

  public getRingInfo() {
    return this.entityStore.getRingInfo();
  }

  public getTownInfo() {
    return this.entityStore.getTownInfo();
  }

  public getRingConfigs() {
    return this.entityStore.getRingConfigs();
  }
}

export default GameManager;
