import styled from "styled-components";
import rustyles from "../Styles/rustyles";
import { useNavigate } from "react-router-dom";
import { Spacer } from "../Components/CoreUI";
import * as Icons from "../Components/Icons";

export const enum LandingPageZIndex {
  Background = 0,
  Canvas = 1,
  BasePage = 2,
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <PrettyOverlayGradient />

      <Page>
        <MainContentContainer>
          <Header>
            <Icons.HomepageLogo />
            <Spacer $height={32} />
            <ButtonWrapper>
              <button onClick={() => navigate("/play")}>Play Game</button>
            </ButtonWrapper>
          </Header>
          <Spacer $height={32} />

          <HallOfFame style={{ color: rustyles.colors.text }}>
            <Icons.HomepageLink />
          </HallOfFame>
        </MainContentContainer>
      </Page>
    </>
  );
}

const PrettyOverlayGradient = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      to left top,
      rgba(74, 74, 74, 0.628),
      rgba(60, 1, 255, 0.2)
    )
    fixed;
  background-position: 50%, 50%;
  display: inline-block;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Page = styled.div`
  position: absolute;
  width: 100vw;
  max-width: 100vw;
  height: 100%;
  color: white;
  font-size: ${rustyles.fontSize};
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${LandingPageZIndex.BasePage};
  justify-content: center;
`;

const MainContentContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.div`
  text-align: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-direction: row;

  @media only screen and (max-device-width: 1000px) {
    grid-template-columns: auto;
    flex-direction: column;
  }

  --ru-button-color: ${rustyles.colors.rugreen};
  --ru-button-border: 1px solid ${rustyles.colors.rugreen};
  --ru-button-hover-background: ${rustyles.colors.rugreen};
  --ru-button-hover-border: 1px solid ${rustyles.colors.rugreen};
`;

const HallOfFame = styled.div`
  @media only screen and (max-device-width: 1000px) {
    font-size: 70%;
  }
`;

const HallOfFameTitle = styled.div`
  color: ${rustyles.colors.subtext};
  display: inline-block;
  border-bottom: 1px solid ${rustyles.colors.subtext};
  line-height: 1em;
`;
