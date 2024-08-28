// import { ArtifactRarity } from "@ringunibersus/types";
import rustyles from "./rustyles";

export const ArtifactRarity = {
  Unknown: 0 as ArtifactRarity,
  Common: 1 as ArtifactRarity,
  Rare: 2 as ArtifactRarity,
  Epic: 3 as ArtifactRarity,
  Legendary: 4 as ArtifactRarity,
  Mythic: 5 as ArtifactRarity,
  // Don't forget to update MIN_ARTIFACT_RARITY and/or MAX_ARTIFACT_RARITY in the `constants` package
} as const;

export const RarityColors = {
  [ArtifactRarity.Unknown]: "#000000",
  [ArtifactRarity.Common]: rustyles.colors.subtext,
  [ArtifactRarity.Rare]: "#6b68ff",
  [ArtifactRarity.Epic]: "#c13cff",
  [ArtifactRarity.Legendary]: "#f8b73e",
  [ArtifactRarity.Mythic]: "#ff44b7",
} as const;
