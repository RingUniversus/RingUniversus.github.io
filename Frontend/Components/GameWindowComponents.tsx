import styled from "styled-components";
import rustyles from "../Styles/rustyles";

export const WindowWrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${rustyles.colors.background};
  height: 100%;
  width: 100%;

  font-size: ${rustyles.game.fontSize};
`;

export const MainWindow = styled.div`
  // position and sizing
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  flex-grow: 1;

  // styling
  background: ${rustyles.colors.background};

  // display inner things
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const CanvasContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

export const CanvasWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const UpperLeft = styled.div`
  position: absolute;
  left: 0;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
