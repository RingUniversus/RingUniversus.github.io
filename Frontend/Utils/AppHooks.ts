import { createDefinedContext } from "./createDefinedContext";
import GameUIManager from "../../Backend/GameLogic/GameUIManager";

export const { useDefinedContext: useUIManager, provider: UIManagerProvider } =
  createDefinedContext<GameUIManager>();

export const {
  useDefinedContext: useTopLevelDiv,
  provider: TopLevelDivProvider,
} = createDefinedContext<HTMLDivElement>();
