import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameLandingPage } from "./GameLandingPage";
import LandingPage from "./LandingPage";
import { createGlobalStyle } from "styled-components";
import rustyles from "../Styles/rustyles";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { coin } from "@ringuniversus/contracts";

// 1. Get projectId
const projectId = import.meta.env.VITE_W3MODAL_PROJECT_ID as string;

// 2. Set chains
const opBNBTestnet = {
  chainId: 5611,
  name: "opBNB Testnet",
  currency: "tBNB",
  explorerUrl: "https://opbnb-testnet.bscscan.com",
  rpcUrl: "https://opbnb-testnet-rpc.bnbchain.org/",
};

// 3. Create a metadata object
const metadata = {
  name: "Ring Universus",
  description: "Ring Universus",
  url: "https://ringuniversus.com", // origin must match your domain & subdomain
  icons: ["https://ringuniversus.com/favicon/favicon-32x32.png"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [opBNBTestnet],
  projectId,
  enableAnalytics: true,
  enableOnramp: false,
  tokens: {
    5611: {
      address: coin.CONTRACT_ADDRESS,
      // image:
      //   "https://images.rawpixel.com/image_png_600/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L3YxMTYxLWItMDQ0LnBuZw.png", //optional
    },
  },
});

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/play" element={<GameLandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
body {
  width: 100vw;
  min-height: 100vh;
  background-color: ${rustyles.colors.background};
}
`;

export default App;
