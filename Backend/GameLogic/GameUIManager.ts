import { Monomitter } from "@ringuniversus/events";
import { EthAddress, Setting } from "@ringuniversus/types";
import autoBind from "auto-bind";
import { AddressLike, BigNumberish } from "ethers";
import EventEmitter from "events";
import deferred from "p-defer";
import React from "react";
import ModalManager from "../../Frontend/Game/ModalManager";
import NotificationManager from "../../Frontend/Game/NotificationManager";
import Viewport from "../../Frontend/Game/Viewport";
// import { getObjectWithIdFromMap } from "../../Frontend/Utils/EmitterUtils";
// import {
//   getBooleanSetting,
//   getSetting,
//   setBooleanSetting,
// } from "../../Frontend/Utils/SettingsHooks";
import UIEmitter, { UIEmitterEvent } from "../../Frontend/Utils/UIEmitter";
import { TerminalHandle } from "../../Frontend/Views/Terminal";
// import { ContractConstants } from "../../_types/darkforest/api/ContractsAPITypes";
// import { HashConfig } from "../../_types/global/GlobalTypes";
// import { MiningPattern } from "../Miner/MiningPatterns";
// import { coordsEqual } from "../Utils/Coordinates";
import GameManager from "./GameManager";
import { GameObjects } from "./GameObjects";
// import { PluginManager } from "./PluginManager";
// import TutorialManager, { TutorialState } from "./TutorialManager";
// import { ViewportEntities } from "./ViewportEntities";

export const enum GameUIManagerEvent {
  InitializedPlayer = "InitializedPlayer",
  InitializedPlayerError = "InitializedPlayerError",
}

class GameUIManager extends EventEmitter {
  private readonly radiusMap: { [PlanetLevel: number]: number };
  private readonly gameManager: GameManager;
  private modalManager: ModalManager;

  private terminal: React.MutableRefObject<TerminalHandle | undefined>;

  /**
   * In order to render React on top of the game, we need to insert React nodes into an overlay
   * container. We keep a reference to this container, so that our React components can optionally
   * choose to render themselves into this overlay container using React Portals.
   */
  private overlayContainer?: HTMLDivElement;
  private previousSelectedPlanetId: LocationId | undefined;
  private selectedPlanetId: LocationId | undefined;
  private selectedCoords: WorldCoords | undefined;
  private mouseDownOverPlanet: LocatablePlanet | undefined;
  private mouseDownOverCoords: WorldCoords | undefined;
  private mouseHoveringOverPlanet: LocatablePlanet | undefined;
  private mouseHoveringOverCoords: WorldCoords | undefined;
  private sendingPlanet: LocatablePlanet | undefined;
  private sendingCoords: WorldCoords | undefined;
  private isSending = false;
  private abandoning = false;
  private viewportEntities: ViewportEntities;

  /**
   * The Wormhole artifact requires you to choose a target planet. This value
   * indicates whether or not the player is currently selecting a target planet.
   */
  private isChoosingTargetPlanet = false;
  private onChooseTargetPlanet?: (planet: LocatablePlanet | undefined) => void;
  // TODO: Remove later and just use minerLocations array
  private minerLocation: WorldCoords | undefined;
  private extraMinerLocations: WorldCoords[] = [];

  private forcesSending: { [key: string]: number } = {}; // this is a percentage
  private silverSending: { [key: string]: number } = {}; // this is a percentage

  private artifactSending: { [key: string]: Artifact | undefined } = {};

  private plugins: PluginManager;

  public readonly selectedPlanetId$: Monomitter<LocationId | undefined>;
  public readonly hoverPlanetId$: Monomitter<LocationId | undefined>;
  public readonly hoverPlanet$: Monomitter<Planet | undefined>;
  public readonly hoverArtifactId$: Monomitter<ArtifactId | undefined>;
  public readonly hoverArtifact$: Monomitter<Artifact | undefined>;
  public readonly myArtifacts$: Monomitter<Map<ArtifactId, Artifact>>;

  public readonly isSending$: Monomitter<boolean>;
  public readonly isAbandoning$: Monomitter<boolean>;

  private planetHoveringInRenderer = false;

  // lifecycle methods

  private constructor(
    gameManager: GameManager,
    terminalHandle: React.MutableRefObject<TerminalHandle | undefined>
  ) {
    super();
    this.gameManager = gameManager;
    this.terminal = terminalHandle;

    autoBind(this);
  }

  /**
   * Sets the overlay container. See {@link GameUIManger.overlayContainer} for more information
   * about what the overlay container is.
   */
  public setOverlayContainer(randomContainer?: HTMLDivElement) {
    this.overlayContainer = randomContainer;
  }

  /**
   * Gets the overlay container. See {@link GameUIManger.overlayContainer} for more information
   * about what the overlay container is.
   */
  public getOverlayContainer(): HTMLDivElement | undefined {
    return this.overlayContainer;
  }

  public static async create(
    gameManager: GameManager,
    terminalHandle: React.MutableRefObject<TerminalHandle | undefined>
  ) {
    // listenForKeyboardEvents();
    const uiEmitter = UIEmitter.getInstance();

    const uiManager = new GameUIManager(gameManager, terminalHandle);
    // const modalManager = await ModalManager.create(gameManager.getChunkStore());

    // uiManager.setModalManager(modalManager);

    // gameManager.on(GameManagerEvent.PlanetUpdate, uiManager.updatePlanets);
    // gameManager.on(
    //   GameManagerEvent.DiscoveredNewChunk,
    //   uiManager.onDiscoveredChunk
    // );

    return uiManager;
  }

  public destroy(): void {
    // unlinkKeyboardEvents();
    // const uiEmitter = UIEmitter.getInstance();

    // uiEmitter.removeListener(UIEmitterEvent.WorldMouseDown, this.onMouseDown);
    // uiEmitter.removeListener(UIEmitterEvent.WorldMouseClick, this.onMouseClick);
    // uiEmitter.removeListener(UIEmitterEvent.WorldMouseMove, this.onMouseMove);
    // uiEmitter.removeListener(UIEmitterEvent.WorldMouseUp, this.onMouseUp);
    // uiEmitter.removeListener(UIEmitterEvent.WorldMouseOut, this.onMouseOut);

    // uiEmitter.removeListener(UIEmitterEvent.SendInitiated, this.onSendInit);
    // uiEmitter.removeListener(UIEmitterEvent.SendCancelled, this.onSendCancel);
    // uiEmitter.removeListener(UIEmitterEvent.SendCompleted, this.onSendComplete);

    // this.gameManager.removeListener(
    //   GameManagerEvent.PlanetUpdate,
    //   this.updatePlanets
    // );
    // this.gameManager.removeListener(
    //   GameManagerEvent.InitializedPlayer,
    //   this.onEmitInitializedPlayer
    // );
    // this.gameManager.removeListener(
    //   GameManagerEvent.InitializedPlayerError,
    //   this.onEmitInitializedPlayerError
    // );
    // this.gameManager.removeListener(
    //   GameManagerEvent.DiscoveredNewChunk,
    //   this.onDiscoveredChunk
    // );

    this.gameManager.destroy();
    // this.selectedPlanetId$.clear();
    // this.hoverArtifactId$.clear();
  }

  public getStringSetting(setting: Setting): string | undefined {
    const account = this.getAccount();
    const config = {
      contractAddress: this.getContractAddress(),
      account,
    };

    return account && getSetting(config, setting);
  }

  public getBooleanSetting(setting: Setting): boolean {
    const account = this.getAccount();

    if (!account) {
      return false;
    }

    const config = { contractAddress: this.getContractAddress(), account };

    return getBooleanSetting(config, setting);
  }

  public getDiagnostics(): Diagnostics {
    return this.gameManager.getDiagnostics();
  }

  public updateDiagnostics(updateFn: (d: Diagnostics) => void) {
    this.gameManager.updateDiagnostics(updateFn);
  }

  // actions
  public centerPlanet(planet: LocatablePlanet | undefined) {
    if (planet) {
      Viewport.getInstance().centerPlanet(planet);
      this.setSelectedPlanet(planet);
    }
  }

  public centerCoords(coords: WorldCoords) {
    const planet = this.gameManager.getPlanetWithCoords(coords);
    if (planet && isLocatable(planet)) {
      this.centerPlanet(planet);
    } else {
      Viewport.getInstance().centerCoords(coords);
    }
  }

  public centerLocationId(planetId: LocationId) {
    const planet = this.getPlanetWithId(planetId);
    if (planet && isLocatable(planet)) {
      this.centerPlanet(planet);
    }
  }

  public joinGame(beforeRetry: (e: Error) => Promise<boolean>): Promise<void> {
    return this.gameManager.joinGame(beforeRetry);
  }

  public addAccount(coords: WorldCoords): Promise<boolean> {
    return this.gameManager.addAccount(coords);
  }

  public verifyTwitter(twitter: string): Promise<boolean> {
    return this.gameManager.submitVerifyTwitter(twitter);
  }

  public disconnectTwitter(twitter: string) {
    return this.gameManager.submitDisconnectTwitter(twitter);
  }

  public getPluginManager(): PluginManager {
    return this.plugins;
  }

  public getPrivateKey(): string | undefined {
    return this.gameManager.getPrivateKey();
  }

  public getMyBalance(): number {
    return this.gameManager.getMyBalanceEth();
  }

  public getMyBalanceBn(): BigNumber {
    return this.gameManager.getMyBalance();
  }

  public getMyBalance$(): Monomitter<BigNumber> {
    return this.gameManager.getMyBalance$();
  }

  public findArtifact(planetId: LocationId) {
    if (this.gameManager.isRoundOver()) {
      alert("This round has ended, and you can no longer find artifacts!");
      return;
    }
    this.gameManager.findArtifact(planetId);
  }

  public prospectPlanet(planetId: LocationId) {
    if (this.gameManager.isRoundOver()) {
      alert("This round has ended, and you can no longer find artifacts!");
      return;
    }
    this.gameManager.prospectPlanet(planetId);
  }

  public withdrawArtifact(locationId: LocationId, artifactId: ArtifactId) {
    this.gameManager.withdrawArtifact(locationId, artifactId);
  }

  public depositArtifact(locationId: LocationId, artifactId: ArtifactId) {
    this.gameManager.depositArtifact(locationId, artifactId);
  }

  public drawAllRunningPlugins(ctx: CanvasRenderingContext2D) {
    this.getPluginManager().drawAllRunningPlugins(ctx);
  }

  public activateArtifact(
    locationId: LocationId,
    id: ArtifactId,
    wormholeTo?: LocationId
  ) {
    const confirmationText =
      `Are you sure you want to activate this artifact? ` +
      `You can only have one artifact active at time. After` +
      ` deactivation, you must wait for a long cooldown` +
      ` before you can activate it again. Some artifacts (bloom filter, black domain, photoid cannon) are consumed on usage.`;

    if (!confirm(confirmationText)) return;

    this.gameManager.activateArtifact(locationId, id, wormholeTo);
  }

  public deactivateArtifact(locationId: LocationId, artifactId: ArtifactId) {
    const confirmationText =
      `Are you sure you want to deactivate this artifact? ` +
      `After deactivation, you must wait for a long cooldown` +
      ` before you can activate it again. Some artifacts (planetary shields) are consumed on deactivation.`;

    if (!confirm(confirmationText)) return;

    this.gameManager.deactivateArtifact(locationId, artifactId);
  }

  public withdrawSilver(locationId: LocationId, amount: number) {
    const dontShowWarningStorageKey = `${this.getAccount()?.toLowerCase()}-withdrawnWarningAcked`;

    if (localStorage.getItem(dontShowWarningStorageKey) !== "true") {
      localStorage.setItem(dontShowWarningStorageKey, "true");
      const confirmationText =
        `Are you sure you want withdraw this silver? Once you withdraw it, you ` +
        `cannot deposit it again. Your withdrawn silver amount will be added to your score. You'll only see this warning once!`;
      if (!confirm(confirmationText)) return;
    }

    this.gameManager.withdrawSilver(locationId, amount);
  }

  public startWormholeFrom(
    planet: LocatablePlanet
  ): Promise<LocatablePlanet | undefined> {
    this.isChoosingTargetPlanet = true;
    this.mouseDownOverCoords = planet.location.coords;
    this.mouseDownOverPlanet = planet;

    const { resolve, promise } = deferred<LocatablePlanet | undefined>();

    this.onChooseTargetPlanet = resolve;

    return promise;
  }

  public revealLocation(locationId: LocationId) {
    this.gameManager.revealLocation(locationId);
  }

  public getNextBroadcastAvailableTimestamp() {
    return this.gameManager.getNextBroadcastAvailableTimestamp();
  }

  public timeUntilNextBroadcastAvailable() {
    return this.gameManager.timeUntilNextBroadcastAvailable();
  }

  public getEnergyArrivingForMove(
    from: LocationId,
    to: LocationId | undefined,
    dist: number | undefined,
    energy: number
  ) {
    return this.gameManager.getEnergyArrivingForMove(
      from,
      to,
      dist,
      energy,
      this.abandoning
    );
  }

  public isOwnedByMe(planet: Planet): boolean {
    return planet.owner === this.gameManager.getAccount();
  }

  public addNewChunk(chunk: Chunk) {
    this.gameManager.addNewChunk(chunk);
  }

  public bulkAddNewChunks(chunks: Chunk[]): Promise<void> {
    return this.gameManager.bulkAddNewChunks(chunks);
  }

  // mining stuff
  public setMiningPattern(pattern: MiningPattern) {
    this.gameManager.setMiningPattern(pattern);
  }

  public getMiningPattern(): MiningPattern | undefined {
    return this.gameManager.getMiningPattern();
  }

  public isMining(): boolean {
    return this.gameManager.isMining();
  }

  // getters

  public getAccount(): AddressLike | undefined {
    return this.gameManager.getAccount();
  }

  public isAdmin(): boolean {
    return this.gameManager.isAdmin();
  }

  public getTwitter(address: EthAddress | undefined): string | undefined {
    return this.gameManager.getTwitter(address);
  }

  public getUpgrade(branch: UpgradeBranchName, level: number): Upgrade {
    return this.gameManager.getUpgrade(branch, level);
  }

  public getSelectedPlanet(): LocatablePlanet | undefined {
    const planet = this.getPlanetWithId(this.selectedPlanetId);

    if (isLocatable(planet)) {
      return planet;
    }

    return undefined;
  }

  public getPreviousSelectedPlanet(): Planet | undefined {
    return this.getPlanetWithId(this.previousSelectedPlanetId);
  }

  public setSelectedId(id: LocationId): void {
    const planet = this.getPlanetWithId(id);
    if (planet && isLocatable(planet)) this.setSelectedPlanet(planet);
  }

  public setSelectedPlanet(planet: LocatablePlanet | undefined): void {
    this.previousSelectedPlanetId = this.selectedPlanetId;

    // if (!planet) {
    //   const tutorialManager = TutorialManager.getInstance(this);
    //   tutorialManager.acceptInput(TutorialState.Deselect);
    // }

    const uiEmitter = UIEmitter.getInstance();
    this.selectedPlanetId = planet?.locationId;
    if (!planet) {
      this.selectedCoords = undefined;
    } else {
      const loc = this.getLocationOfPlanet(planet.locationId);
      if (!loc) this.selectedCoords = undefined;
      else {
        // loc is not undefined
        this.selectedCoords = loc.coords;

        if (coordsEqual(loc.coords, this.getHomeCoords())) {
          const tutorialManager = TutorialManager.getInstance(this);
          tutorialManager.acceptInput(TutorialState.HomePlanet);
        }
      }
    }
    uiEmitter.emit(UIEmitterEvent.GamePlanetSelected);

    this.selectedPlanetId$.publish(planet?.locationId);
  }

  public getIsHighPerfMode(): boolean {
    return false;
    const account = this.getAccount();

    if (account === undefined) {
      return false;
    }

    return this.getBooleanSetting(Setting.HighPerformanceRendering);
  }

  /**
   * Gets a reference to the game's internal representation of the world state. Beware! Use this for
   * reading only, otherwise you might mess up the state of the game. You can try modifying the game
   * state in some way
   */
  public getGameObjects(): GameObjects {
    return this.gameManager.getGameObjects();
  }

  public getGameManager(): GameManager {
    return this.gameManager;
  }

  public getNotificationManager(): NotificationManager {
    return NotificationManager.getInstance();
  }

  private setModalManager(modalManager: ModalManager) {
    this.modalManager = modalManager;
  }

  public getModalManager(): ModalManager {
    return this.modalManager;
  }

  getPaused(): boolean {
    return this.gameManager.getPaused();
  }

  getPaused$(): Monomitter<boolean> {
    return this.gameManager.getPaused$();
  }

  public getUIEmitter() {
    return UIEmitter.getInstance();
  }

  public getContractAddress(): EthAddress {
    return "0x000000";
  }

  /** My own */
  public getGameEventEmitter() {
    return this.gameManager.getGameEventEmitter();
  }

  public getPlayer(address?: AddressLike): Player | undefined {
    return this.gameManager.getPlayer(address);
  }

  public playerMoveToTarget(x: number, y: number) {
    // TODO: add ismoving player alert
    return this.gameManager.playerMoveToTarget(x, y);
  }

  public playerStopMoving() {
    return this.gameManager.playerStopMoving();
  }

  public teleportToTown(ttype: BigNumberish, tId: BigNumberish) {
    return this.gameManager.teleportToTown(ttype, tId);
  }

  public playerClaimRewards() {
    return this.gameManager.playerClaimRewards();
  }

  public getRingInfo() {
    return this.gameManager.getRingInfo();
  }
  public getRingConfigs() {
    return this.gameManager.getRingConfigs();
  }

  public getTownInfo() {
    return this.gameManager.getTownInfo();
  }
}

export default GameUIManager;
