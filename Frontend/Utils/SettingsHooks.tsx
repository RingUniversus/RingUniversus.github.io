import { AutoGasSetting, EthAddress, Setting } from "@ringuniversus/types";

function onlyInProduction(): string {
  return process.env.NODE_ENV === "production" ? "true" : "false";
}

function onlyInDevelopment(): string {
  return process.env.NODE_ENV !== "production" ? "true" : "false";
}

const defaultSettings: Record<Setting, string> = {
  [Setting.OptOutMetrics]: onlyInDevelopment(),
  [Setting.AutoApproveNonPurchaseTransactions]: onlyInDevelopment(),
  [Setting.DrawChunkBorders]: "false",
  [Setting.HighPerformanceRendering]: "false",
  [Setting.MoveNotifications]: "true",
  [Setting.HasAcceptedPluginRisk]: onlyInDevelopment(),
  [Setting.GasFeeGwei]: AutoGasSetting.Average,
  [Setting.TerminalVisible]: "true",
  [Setting.TutorialOpen]: onlyInProduction(),

  [Setting.FoundPirates]: "false",
  [Setting.TutorialCompleted]: "false",
  [Setting.FoundSilver]: "false",
  [Setting.FoundSilverBank]: "false",
  [Setting.FoundTradingPost]: "false",
  [Setting.FoundComet]: "false",
  [Setting.FoundArtifact]: "false",
  [Setting.FoundDeepSpace]: "false",
  [Setting.FoundSpace]: "false",
  // prevent the tutorial and help pane popping up in development mode.
  [Setting.NewPlayer]: onlyInProduction(),
  [Setting.MiningCores]: "1",
  [Setting.IsMining]: "true",
  [Setting.DisableDefaultShortcuts]: "false",
  [Setting.ExperimentalFeatures]: "false",
  [Setting.DisableEmojiRendering]: "false",
  [Setting.DisableHatRendering]: "false",
  [Setting.AutoClearConfirmedTransactionsAfterSeconds]: "-1",
  [Setting.AutoClearRejectedTransactionsAfterSeconds]: "-1",
  [Setting.DisableFancySpaceEffect]: "false",
  [Setting.RendererColorInnerNebula]: "#186469",
  [Setting.RendererColorNebula]: "#0B2B5B",
  [Setting.RendererColorSpace]: "#0B0F34",
  [Setting.RendererColorDeepSpace]: "#0B061F",
  [Setting.RendererColorDeadSpace]: "#11291b",
  [Setting.ForceReloadEmbeddedPlugins]: "false",
};

interface SettingStorageConfig {
  contractAddress: EthAddress;
  account: EthAddress | undefined;
}

/**
 * Each setting is stored in local storage. Each account has their own setting.
 */
export function getLocalStorageSettingKey(
  { contractAddress, account }: SettingStorageConfig,
  setting: Setting
): string {
  if (account === undefined) {
    return contractAddress + ":anonymous:" + setting;
  }

  return contractAddress + ":" + account + ":" + setting;
}

/**
 * Read the local storage setting from local storage.
 */
export function getSetting(
  config: SettingStorageConfig,
  setting: Setting
): string {
  const key = getLocalStorageSettingKey(config, setting);

  let valueInStorage = localStorage.getItem(key);

  if (valueInStorage === null) {
    valueInStorage = defaultSettings[setting];
  }

  return valueInStorage;
}
