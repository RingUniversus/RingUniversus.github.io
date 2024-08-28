import GameManager from "../../Backend/GameLogic/GameManager";
import GameUIManager from "../../Backend/GameLogic/GameUIManager";

declare global {
  interface Window {
    // TODO: these three should eventually live in some sort of `RUTerminal` namespace
    // instead of global
    ru?: GameManager;
    ui?: GameUIManager;

    // injected into global scope via netlify snippets - this is a permalink
    // to the deployment hosted on netlify.
    DEPLOY_URL?: string;
  }
}
