import { BigNumberish } from "ethers";

export const enum ContractsAPIEvent {
  PlayerUpdate = "PlayerUpdate",
  PlanetUpdate = "PlanetUpdate",
  PauseStateChanged = "PauseStateChanged",
  ArrivalQueued = "ArrivalQueued",
  ArtifactUpdate = "ArtifactUpdate",
  RadiusUpdated = "RadiusUpdated",
  LocationRevealed = "LocationRevealed",
  /**
   * The transaction has been queued for future execution.
   */
  TxQueued = "TxQueued",
  /**
   * The transaction has been removed from the queue and is
   * calculating arguments in preparation for submission.
   */
  TxProcessing = "TxProcessing",
  /**
   * The transaction is queued, but is prioritized for execution
   * above other queued transactions.
   */
  TxPrioritized = "TxPrioritized",
  /**
   * The transaction has been submitted and we are awaiting
   * confirmation.
   */
  TxSubmitted = "TxSubmitted",
  /**
   * The transaction has been confirmed.
   */
  TxConfirmed = "TxConfirmed",
  /**
   * The transaction has failed for some reason. This
   * could either be a revert or a purely client side
   * error. In the case of a revert, the transaction hash
   * will be included in the transaction object.
   */
  TxErrored = "TxErrored",
  /**
   * The transaction was cancelled before it left the queue.
   */
  TxCancelled = "TxCancelled",
  PlanetTransferred = "PlanetTransferred",
  PlanetClaimed = "PlanetClaimed",
  LobbyCreated = "LobbyCreated",
}

/**
 * Represents the coordinates of a location in the world.
 */
export type WorldCoords = {
  x: number;
  y: number;
};

export function divHundred(n: BigNumberish): number {
  return Number(n) / 100;
}

export function coords(coords: {
  x: BigNumberish;
  y: BigNumberish;
}): WorldCoords {
  return {
    x: divHundred(coords.x),
    y: divHundred(coords.y),
  };
}
