// import { SpaceType, WorldCoords } from "@ringuniversus/types";
import styled from "styled-components";

const StyledWalletConnectPane = styled.div`
  position: absolute;
  top: 1em;
  right: 1em;
  /* padding: 0.5em; */
  color: #ffff;

  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  z-index: 10;

  /* width: 16em; */
  /* height: 4em; */
`;

export function WalletConnectPanel() {
  return (
    <StyledWalletConnectPane>
      <w3m-button />
    </StyledWalletConnectPane>
  );
}
