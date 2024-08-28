import ReactDOM from "react-dom/client";
import styled from "styled-components";
import Player from "./Player";
import { WorldCoords } from "../../../_types/ringuniversus/PlayerAPITypes";

const InfoPaneContainer = styled.div`
  position: fixed;
  background-color: white;
  border: 1px solid black;
  padding: 10px;
  z-index: 1000;
  width: 15em;
  box-sizing: border-box;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PinButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  padding: 5px 10px;
  font-size: 12px;

  &:hover {
    background: #ddd;
  }

  &:active {
    background: #ccc;
  }
`;

const ActionButton = styled.div`
  background: #007bff;
  color: white;
  border: 1px solid #007bff;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;

  &:hover {
    background: #0056b3;
    border-color: #0056b3;
  }

  &:active {
    background: #004080;
    border-color: #004080;
  }
`;

export function PlayerInfoPaneComponent(props: {
  nickname: string;
  location: WorldCoords;
  onStopMoving: () => void; // Add the callback prop for stop moving
  showStopMoving: boolean;
  onPinToggle: () => void;
  isPinned: boolean;
  onClaimRewards: () => void; // Add the callback prop for claim rewards
  showClaimRewards: boolean;
}) {
  return (
    <InfoPaneContainer>
      <PinButton onClick={props.onPinToggle}>
        {props.isPinned ? "Unpin" : "Pin"}
      </PinButton>

      <span>
        x: {props.location.x.toFixed(2)}, y: {props.location.y.toFixed(2)}
      </span>
      <InfoItem>
        <strong>Name:</strong> {props.nickname}
      </InfoItem>
      {props.showStopMoving && (
        <InfoItem>
          <ActionButton onClick={props.onStopMoving}>Stop moving</ActionButton>
        </InfoItem>
      )}
      {props.showClaimRewards && (
        <InfoItem>
          <ActionButton onClick={props.onClaimRewards}>
            Claim Rewards
          </ActionButton>
        </InfoItem>
      )}
      {/* <InfoItem>
        <strong>Level:</strong> {props.level}
      </InfoItem> */}
    </InfoPaneContainer>
  );
}

export default class PlayerInfoPane extends Phaser.GameObjects.DOMElement {
  dom: HTMLDivElement;
  root: ReactDOM.Root;
  player: object;
  p: Player;
  pin: boolean = false;

  constructor(p: Player, x: number, y: number) {
    super(p.scene, x, y);
    this.p = p;
    this.player = p.playerInstance;

    this.dom = document.createElement("div");
    this.setElement(this.dom);

    this.root = ReactDOM.createRoot(this.dom);
    this.render();

    // Update the coordinates every frame
    p.scene.events.on("update", this.updateCoords, this);
  }

  updateCoords() {
    // Re-render with updated coordinates
    this.render();
  }

  private render() {
    this.root.render(
      <PlayerInfoPaneComponent
        nickname={this.player.info.nickname}
        location={{ x: this.p.x, y: this.p.y }}
        onStopMoving={this.onStopMoving.bind(this)}
        showStopMoving={this.player.info.status === 1}
        onPinToggle={this.onPinToggle.bind(this)}
        isPinned={this.pin}
        onClaimRewards={this.onClaimRewards.bind(this)}
        showClaimRewards={
          this.player.info.status === 0 &&
          !this.player.moveInfo.isClaimed &&
          this.player.moveInfo.endTime
        }
      />
    );
  }

  onPinToggle() {
    this.pin = !this.pin;
    this.render();
  }

  onClaimRewards() {
    console.log("Claim rewards clicked");
    return this.p.claimRewards();
  }

  onStopMoving() {
    console.log("Stop moving clicked");
    return this.p.stopMoving();
  }

  destroy(fromScene?: boolean): void {
    // Clean up the event listener
    this.p.scene.events.off("update", this.updateCoords, this);
    this.root.unmount();
    super.destroy(fromScene);
  }
}
