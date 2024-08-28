import ReactDOM from "react-dom/client";
import styled from "styled-components";
import GameUIManager from "../../../Backend/GameLogic/GameUIManager";
import React, { forwardRef, useImperativeHandle, useState } from "react";

export enum ActionGroup {
  Divider,
  FunctionBtn,
}

const MenuContainer = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid black;
  list-style-type: none;
  margin: 0;
  padding: 5px;
  z-index: 1000;
  width: 10em;
`;

const MenuItem = styled.li`
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

const Divider = styled.div<{ label?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 0 0;

  &::before {
    content: "${(props) => props.label || ""}";
    color: #3335;
    font-size: 12px;
  }

  &::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background-color: #ccc;
    margin-left: 10px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 2000;
  font-size: 1.2em;
`;

export const ActionMenuComponent = forwardRef(
  (
    props: {
      actions: { name: string; type: ActionGroup; function?: Function }[];
      x: number;
      y: number;
      gameUIManager: GameUIManager;
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const notifManager = props.gameUIManager.getNotificationManager();

    // Expose the loading state to the parent component via the ref
    useImperativeHandle(ref, () => ({
      isLoading: () => loading,
    }));

    const handleActionClick = async (actionFunction: Function) => {
      setLoading(true);
      try {
        await actionFunction(props.x, props.y, props.gameUIManager);
      } catch (error) {
        console.error("Error executing action:", error);
        notifManager.txExecuteError(String(error));
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    return (
      <MenuContainer>
        {loading && <LoadingOverlay>Loading...</LoadingOverlay>}
        {props.actions.map((action, index) => (
          <React.Fragment key={index}>
            {action.type === ActionGroup.Divider ? (
              <Divider label={action.name} />
            ) : action.type === ActionGroup.FunctionBtn ? (
              <MenuItem onClick={() => handleActionClick(action.function!)}>
                {action.name}
              </MenuItem>
            ) : null}
          </React.Fragment>
        ))}
      </MenuContainer>
    );
  }
);

export default class ActionMenu extends Phaser.GameObjects.DOMElement {
  dom: HTMLDivElement;
  componentRef = React.createRef<{ isLoading: () => boolean }>();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameUIManager: GameUIManager,
    actions: { name: string; type: ActionGroup; function?: Function }[]
  ) {
    super(scene, x, y);

    this.dom = document.createElement("div");
    this.setElement(this.dom);

    const root = ReactDOM.createRoot(this.dom);
    root.render(
      <ActionMenuComponent
        ref={this.componentRef}
        actions={actions}
        x={x}
        y={y}
        gameUIManager={gameUIManager}
      />
    );
  }

  destroy(fromScene?: boolean): boolean {
    // Check if the component is in a loading state before destroying
    if (this.componentRef.current?.isLoading()) {
      console.log("Menu is loading, cannot destroy.");
      return false;
    }

    // Proceed with destruction if not loading
    super.destroy(fromScene);
    return true;
  }
}
