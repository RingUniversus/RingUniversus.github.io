import { GameWindowLayout } from "../Views/GameWindowLayout";
import {
  GameWindowWrapper,
  InitRenderState,
  TerminalToggler,
  TerminalWrapper,
  Wrapper,
} from "../Components/GameLandingPageComponents";
import { useCallback, useEffect, useRef, useState } from "react";
import GameUIManager from "../../Backend/GameLogic/GameUIManager";
import { Terminal, TerminalHandle } from "../Views/Terminal";
import UIEmitter, { UIEmitterEvent } from "../Utils/UIEmitter";
import { TerminalTextStyle } from "../Utils/TerminalTypes";
import { TopLevelDivProvider, UIManagerProvider } from "../Utils/AppHooks";
import GameManager from "../../Backend/GameLogic/GameManager";
import { Incompatibility, unsupportedFeatures } from "../Utils/BrowserChecks";
import { MythicLabelText } from "../Components/Labels/MythicLabel";
import { PlayerAPI } from "../../Backend/GameLogic/ContractsAPI";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { WalletConnectPanel } from "../Panes/WalletConnectPane";

const enum TerminalPromptStep {
  NONE,
  COMPATIBILITY_CHECKS_PASSED,
  WALLET_NOT_CONNECTED,
  ACCOUNT_SET,
  PLAYER_NOT_INITIALIZE,
  FETCHING_ETH_DATA,
  ALL_CHECKS_PASS,
  COMPLETE,
  TERMINATED,
  ERROR,
}

export function GameLandingPage() {
  const terminalHandle = useRef<TerminalHandle>();
  const gameUIManagerRef = useRef<GameUIManager | undefined>();
  const topLevelContainer = useRef<HTMLDivElement | null>(null);

  const [gameManager, setGameManager] = useState<GameManager | undefined>();
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [initRenderState, setInitRenderState] = useState(InitRenderState.NONE);

  const [step, setStep] = useState(TerminalPromptStep.NONE);
  // 4. Use modal hook
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const isProd = import.meta.env.NODE_ENV === "production";

  useEffect(() => {
    if (isConnected !== true) {
      setStep(TerminalPromptStep.WALLET_NOT_CONNECTED);
    }
  }, [isConnected]);

  const advanceStateFromNone = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      const issues = await unsupportedFeatures();

      if (issues.includes(Incompatibility.MobileOrTablet)) {
        terminal.current?.println(
          "ERROR: Mobile or tablet device detected. Please use desktop.",
          TerminalTextStyle.Red
        );
      }

      if (issues.includes(Incompatibility.NoIDB)) {
        terminal.current?.println(
          "ERROR: IndexedDB not found. Try using a different browser.",
          TerminalTextStyle.Red
        );
      }

      if (issues.includes(Incompatibility.UnsupportedBrowser)) {
        terminal.current?.println(
          "ERROR: Browser unsupported. Try Brave, Firefox, or Chrome.",
          TerminalTextStyle.Red
        );
      }

      if (issues.length > 0) {
        terminal.current?.print(
          `${issues.length.toString()} errors found. `,
          TerminalTextStyle.Red
        );
        terminal.current?.println("Please resolve them and refresh the page.");
      } else {
        setStep(TerminalPromptStep.COMPATIBILITY_CHECKS_PASSED);
      }
    },
    []
  );

  const advanceStateFromWalletNotConnect = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      if (isConnected === true) {
        setStep(TerminalPromptStep.ACCOUNT_SET);
      } else {
        terminal.current?.println(
          "Wallet connecting...",
          TerminalTextStyle.Text
        );
      }
    },
    [isConnected]
  );

  const advanceStateFromCompatibilityPassed = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      terminal.current?.newline();
      terminal.current?.newline();
      terminal.current?.printElement(
        <MythicLabelText text={`                 Ring Universus`} />
      );
      terminal.current?.newline();
      terminal.current?.newline();

      terminal.current?.print("    ");
      terminal.current?.print("No.", TerminalTextStyle.Sub);
      terminal.current?.print("    ");
      terminal.current?.print("Player", TerminalTextStyle.Sub);
      terminal.current?.print("              ");
      terminal.current?.print("Union", TerminalTextStyle.Sub);
      terminal.current?.newline();

      terminal.current?.print("    #1       ", TerminalTextStyle.Text);
      terminal.current?.print("0x01        ", TerminalTextStyle.Text);
      terminal.current?.printLink(
        "Union #01",
        () => {
          window.open("https://x.com/union_no01");
        },
        TerminalTextStyle.Text
      );
      terminal.current?.newline();
      terminal.current?.print("    #2       ", TerminalTextStyle.Text);
      terminal.current?.println(
        "0x02        Union #02",
        TerminalTextStyle.Text
      );
      terminal.current?.print("    #3       ", TerminalTextStyle.Text);
      terminal.current?.print("0x03        ", TerminalTextStyle.Text);
      terminal.current?.printLink(
        "Union #03",
        () => {
          window.open("https://x.com/union_no03");
        },
        TerminalTextStyle.Text
      );
      terminal.current?.newline();
      // terminal.current?.print("    v0.5       ", TerminalTextStyle.Text);
      // terminal.current?.print("12/25/2020        ", TerminalTextStyle.Text);
      // terminal.current?.printElement(
      //   <TextPreview
      //     text={"0xb05d95422bf8d5024f9c340e8f7bd696d67ee3a9"}
      //     focusedWidth={"100px"}
      //     unFocusedWidth={"100px"}
      //   />
      // );
      // terminal.current?.println("");

      // terminal.current?.print("    v0.6 r1    ", TerminalTextStyle.Text);
      // terminal.current?.print("05/22/2021        ", TerminalTextStyle.Text);
      // terminal.current?.printLink(
      //   "Ansgar Dietrichs",
      //   () => {
      //     window.open("https://twitter.com/adietrichs");
      //   },
      //   TerminalTextStyle.Text
      // );
      // terminal.current?.newline();

      // terminal.current?.print("    v0.6 r2    ", TerminalTextStyle.Text);
      // terminal.current?.print("06/28/2021        ", TerminalTextStyle.Text);
      // terminal.current?.printLink(
      //   "@orden_gg",
      //   () => {
      //     window.open("https://twitter.com/orden_gg");
      //   },
      //   TerminalTextStyle.Text
      // );
      // terminal.current?.newline();

      // terminal.current?.print("    v0.6 r3    ", TerminalTextStyle.Text);
      // terminal.current?.print("08/22/2021        ", TerminalTextStyle.Text);
      // terminal.current?.printLink(
      //   "@dropswap_gg",
      //   () => {
      //     window.open("https://twitter.com/dropswap_gg");
      //   },
      //   TerminalTextStyle.Text
      // );
      // terminal.current?.newline();

      // terminal.current?.print("    v0.6 r4    ", TerminalTextStyle.Text);
      // terminal.current?.print("10/01/2021        ", TerminalTextStyle.Text);
      // terminal.current?.printLink(
      //   "@orden_gg",
      //   () => {
      //     window.open("https://twitter.com/orden_gg");
      //   },
      //   TerminalTextStyle.Text
      // );
      // terminal.current?.newline();

      // terminal.current?.print("    v0.6 r5    ", TerminalTextStyle.Text);
      // terminal.current?.print("02/18/2022        ", TerminalTextStyle.Text);
      // terminal.current?.printLink(
      //   "@d_fdao",
      //   () => {
      //     window.open("https://twitter.com/d_fdao");
      //   },
      //   TerminalTextStyle.Text
      // );
      // terminal.current?.print(" + ");
      // terminal.current?.printLink(
      //   "@orden_gg",
      //   () => {
      //     window.open("https://twitter.com/orden_gg");
      //   },
      //   TerminalTextStyle.Text
      // );
      // terminal.current?.newline();
      terminal.current?.newline();

      setStep(TerminalPromptStep.WALLET_NOT_CONNECTED);
    },
    []
  );

  const advanceStateFromAccountSet = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      if (isConnected === true) {
        terminal.current?.println("Wallet connected!", TerminalTextStyle.Green);

        // try {
        const playerAddress = address;
        console.log("playerAddress: ", playerAddress);
        if (!playerAddress || !walletProvider) throw new Error("not logged in");

        terminal.current?.println("");
        terminal.current?.println("Checking if player initialized... ");
        const playerAPI = await PlayerAPI.instance(walletProvider);
        const playerInfo = await playerAPI.contract.playerInfo(playerAddress);
        const isInitialized = playerInfo.createdAt === 0n ? false : true;

        if (isInitialized) {
          terminal.current?.println("Player initialized.");
          terminal.current?.println("");
          const joinedDate = new Date(Number(playerInfo.createdAt) * 1000);
          console.log(joinedDate);
          terminal.current?.println(
            `Welcome, ${
              playerInfo.nickname
            }(${playerAddress}). ${joinedDate.toLocaleString()}`
          );
          // TODO: Provide own env variable for this feature
          // if (!isProd) {
          //   // in development, automatically get some ether from faucet
          //   const balance = weiToEth(
          //     await ethConnection?.loadBalance(playerAddress)
          //   );
          //   if (balance === 0) {
          //     await requestDevFaucet(playerAddress);
          //   }
          // }
          setStep(TerminalPromptStep.FETCHING_ETH_DATA);
        } else {
          setStep(TerminalPromptStep.PLAYER_NOT_INITIALIZE);
        }
        // } catch (e) {
        //   console.error(`error connecting to player info: ${e}`);
        //   terminal.current?.println(
        //     "ERROR: Could not connect to player contract. Please refresh and try again in a few minutes.",
        //     TerminalTextStyle.Red
        //   );
        //   setStep(TerminalPromptStep.TERMINATED);
        // }
      }
    },
    [isProd, isConnected, walletProvider]
  );

  const advanceStateFromPlayerNotInitalize = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      let isInit: Boolean = false;
      terminal.current?.println(
        "Address's player not initalize, please insert following infomations.",
        TerminalTextStyle.Text
      );
      terminal.current?.print("Player's nickname: ", TerminalTextStyle.Text);
      const nickname = await terminal.current?.getInput();
      console.log("nickname: ", nickname);

      if (nickname !== undefined) {
        if (nickname.length > 5 && nickname.length <= 20) {
          const playerAPI = await PlayerAPI.instance(walletProvider!);
          await playerAPI.contract
            .initPlayer(nickname)
            .then((resp) => {
              console.log(resp);
              isInit = true;
            })
            .catch((e) => {
              console.log(e);
              terminal.current?.println("Init player error, please try again!");
            });
        }
      }
      if (isInit == true) {
        setStep(TerminalPromptStep.ACCOUNT_SET);
      } else {
        terminal.current?.println("Unrecognized input. Please try again.");
        await advanceStateFromPlayerNotInitalize(terminal);
      }
    },
    []
  );

  const advanceStateFromFetchingEthData = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      if (!walletProvider) throw new Error("not logged in");
      let newGameManager: GameManager;

      try {
        newGameManager = await GameManager.create({
          terminal,
          walletProvider,
        });
      } catch (e) {
        console.error(e);

        setStep(TerminalPromptStep.ERROR);

        terminal.current?.print(
          "Network under heavy load. Please refresh the page, and check ",
          TerminalTextStyle.Red
        );

        terminal.current?.printLink(
          "https://opbnb.bscscan.com/",
          () => {
            window.open("https://opbnb.bscscan.com/");
          },
          TerminalTextStyle.Red
        );

        terminal.current?.println("");

        return;
      }

      setGameManager(newGameManager);

      window.ru = newGameManager;

      const newGameUIManager = await GameUIManager.create(
        newGameManager,
        terminal
      );

      window.ui = newGameUIManager;

      terminal.current?.newline();
      terminal.current?.println("Connected to Ring Universus Contract");
      gameUIManagerRef.current = newGameUIManager;

      terminal.current?.println("Check token Allowance...");
      const allowance = await newGameManager.tokenAllowance();
      terminal.current?.println(`Current Allowance amount: ${allowance}`);
      if (allowance < 10000000 * 1e18) {
        terminal.current?.println(
          "Token Allowance too low, please approve more!",
          TerminalTextStyle.Red
        );
        await newGameManager.tokenApprove();
      }

      terminal.current?.println("Initializing game...");
      setStep(TerminalPromptStep.ALL_CHECKS_PASS);
    },
    [walletProvider]
  );

  const advanceStateFromAllChecksPass = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      terminal.current?.println("");
      terminal.current?.println("Press ENTER to begin");
      // terminal.current?.println(
      //   "Press 's' then ENTER to begin in SAFE MODE - plugins disabled"
      // );

      const input = await terminal.current?.getInput();
      // if (input === "s") {
      //   // const gameUIManager = gameUIManagerRef.current;
      //   // gameUIManager?.getGameManager()?.setSafeMode(true);
      // }

      setStep(TerminalPromptStep.COMPLETE);
      setInitRenderState(InitRenderState.COMPLETE);
      terminal.current?.clear();

      terminal.current?.println(
        "Welcome to the Ring Universus.",
        TerminalTextStyle.Green
      );
      terminal.current?.println("");
      terminal.current?.println(
        "This is the Ring Universus interactive JavaScript terminal. Only use this if you know exactly what you're doing."
      );
      terminal.current?.println("");
      terminal.current?.println("Try running: ru.getAccount()");
      terminal.current?.println("");
    },
    []
  );

  const advanceStateFromComplete = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      const input = (await terminal.current?.getInput()) || "";
      let res = "";
      try {
        // indrect eval call: http://perfectionkills.com/global-eval-what-are-the-options/
        res = (1, eval)(input);
        if (res !== undefined) {
          terminal.current?.println(res.toString(), TerminalTextStyle.Text);
        }
      } catch (e: any) {
        res = e.message;
        console.log(`ERROR: ${res}`);
        terminal.current?.println(`ERROR: ${res}`, TerminalTextStyle.Red);
      }
      advanceStateFromComplete(terminal);
    },
    []
  );

  const advanceStateFromError = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      terminal.current?.println(`ERROR`, TerminalTextStyle.Red);
    },
    []
  );

  const advanceState = useCallback(
    async (terminal: React.MutableRefObject<TerminalHandle | undefined>) => {
      // console.log(
      //   `step: ${step}(${TerminalPromptStep[step]})`,
      //   "\nterminalVisible: ",
      //   terminalVisible,
      //   "\ninitRenderState: ",
      //   initRenderState
      // );
      if (step === TerminalPromptStep.NONE) {
        await advanceStateFromNone(terminal);
      } else if (step === TerminalPromptStep.COMPATIBILITY_CHECKS_PASSED) {
        await advanceStateFromCompatibilityPassed(terminal);
      } else if (step === TerminalPromptStep.WALLET_NOT_CONNECTED) {
        await advanceStateFromWalletNotConnect(terminal);
      } else if (step === TerminalPromptStep.ACCOUNT_SET) {
        await advanceStateFromAccountSet(terminal);
      } else if (step === TerminalPromptStep.PLAYER_NOT_INITIALIZE) {
        await advanceStateFromPlayerNotInitalize(terminal);
      } else if (step === TerminalPromptStep.FETCHING_ETH_DATA) {
        await advanceStateFromFetchingEthData(terminal);
      } else if (step === TerminalPromptStep.ALL_CHECKS_PASS) {
        await advanceStateFromAllChecksPass(terminal);
      } else if (step === TerminalPromptStep.COMPLETE) {
        await advanceStateFromComplete(terminal);
      } else if (step === TerminalPromptStep.ERROR) {
        await advanceStateFromError(terminal);
      }
    },
    [
      step,
      advanceStateFromNone,
      advanceStateFromCompatibilityPassed,
      advanceStateFromAccountSet,
      advanceStateFromWalletNotConnect,
      advanceStateFromPlayerNotInitalize,
      advanceStateFromFetchingEthData,
      advanceStateFromAllChecksPass,
      advanceStateFromComplete,
      advanceStateFromError,
    ]
  );

  useEffect(() => {
    const uiEmitter = UIEmitter.getInstance();
    uiEmitter.emit(UIEmitterEvent.UIChange);
  }, [initRenderState]);

  useEffect(() => {
    const gameUiManager = gameUIManagerRef.current;
    if (!terminalVisible && gameUiManager) {
      // const tutorialManager = TutorialManager.getInstance(gameUiManager);
      // tutorialManager.acceptInput(TutorialState.Terminal);
    }
  }, [terminalVisible]);

  useEffect(() => {
    if (terminalHandle.current && topLevelContainer.current) {
      advanceState(terminalHandle);
    }
  }, [terminalHandle, topLevelContainer, advanceState]);

  return (
    <Wrapper $initRender={initRenderState} $terminalEnabled={terminalVisible}>
      <WalletConnectPanel />
      <GameWindowWrapper
        $initRender={initRenderState}
        $terminalEnabled={terminalVisible}
      >
        {gameUIManagerRef.current &&
          topLevelContainer.current &&
          gameManager && (
            <TopLevelDivProvider value={topLevelContainer.current}>
              <UIManagerProvider value={gameUIManagerRef.current}>
                <GameWindowLayout
                  terminalVisible={terminalVisible}
                  setTerminalVisible={setTerminalVisible}
                />
              </UIManagerProvider>
            </TopLevelDivProvider>
          )}
        <TerminalToggler
          $terminalEnabled={terminalVisible}
          setTerminalEnabled={setTerminalVisible}
        />
      </GameWindowWrapper>
      <TerminalWrapper
        $initRender={initRenderState}
        $terminalEnabled={terminalVisible}
      >
        <Terminal ref={terminalHandle} promptCharacter={"$"} />
      </TerminalWrapper>
      <div ref={topLevelContainer}></div>
    </Wrapper>
  );
}
