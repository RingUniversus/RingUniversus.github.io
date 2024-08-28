import { useEffect, useState } from "react";
import {
  CanvasContainer,
  CanvasWrapper,
  MainWindow,
  WindowWrapper,
} from "../Components/GameWindowComponents";
import ControllableCanvas from "../Game/ControllableCanvas";
import { useUIManager } from "../Utils/AppHooks";
import { NotificationsPane } from "./Notifications";

export function GameWindowLayout({
  terminalVisible,
  setTerminalVisible,
}: {
  terminalVisible: boolean;
  setTerminalVisible: (visible: boolean) => void;
}) {
  const uiManager = useUIManager();

  const account = uiManager.getAccount();
  useEffect(() => {
    if (uiManager.getAccount()) {
      setTerminalVisible(false);
    }
  }, [account, uiManager, setTerminalVisible]);

  return (
    <WindowWrapper>
      <MainWindow>
        <CanvasContainer>
          {/* <UpperLeft>
            <ZoomPane />
          </UpperLeft> */}

          <CanvasWrapper>
            <ControllableCanvas />
          </CanvasWrapper>
        </CanvasContainer>

        <NotificationsPane />
        {/* <CoordsPane /> */}
        {/* <ExplorePane /> */}
      </MainWindow>
    </WindowWrapper>
  );
}
