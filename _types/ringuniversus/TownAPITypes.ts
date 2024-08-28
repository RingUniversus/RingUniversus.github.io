import { TownStruct } from "@ringuniversus/contracts/typechain/contracts/town/facets/RUTownFacet";
import { coords } from "./ContractsAPITypes";

export default class TownAPITypes {
  public static transformTownInfo(data: TownStruct) {
    return {
      nickname: data.nickname,
      flagPath: data.flagPath,
      location: coords(data.location),
      level: Number(data.level),
      explorerFeeRatio: Number(data.explorerFeeRatio),
      explorerSlot: Number(data.explorerSlot),
      createdAt: Number(data.createdAt),
    };
  }
}
