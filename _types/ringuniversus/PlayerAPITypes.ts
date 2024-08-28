import {
  InfoStruct,
  MovingStruct,
} from "@ringuniversus/contracts/typechain/contracts/player/facets/RUPlayerFacet";
import { coords, divHundred } from "./ContractsAPITypes";

export default class PlayerAPITypes {
  public static transformPlayerInfo(data: {
    info: InfoStruct;
    moveInfo: MovingStruct;
  }) {
    return {
      info: {
        nickname: data.info.nickname,
        location: coords(data.info.location),
        lastMoveTime: Number(data.info.lastMoveTime),
        status: Number(data.info.status),
        moveSpeed: divHundred(data.info.moveSpeed),
        attackPower: divHundred(data.info.attackPower),
        createdAt: Number(data.info.createdAt),
      },
      moveInfo: {
        target: coords(data.moveInfo.target),
        start: coords(data.moveInfo.start),
        end: coords(data.moveInfo.end),
        spendTime: Number(data.moveInfo.spendTime),
        speed: divHundred(data.moveInfo.speed),
        distance: divHundred(data.moveInfo.distance),
        startTime: Number(data.moveInfo.startTime),
        endTime: Number(data.moveInfo.endTime),
        maxTownToMint: Number(data.moveInfo.maxTownToMint),
        townMintRatio: Number(data.moveInfo.townMintRatio),
        bountyMintRatio: Number(data.moveInfo.bountyMintRatio),
        segmentationDistance: Number(data.moveInfo.segmentationDistance),
        randomWords: data.moveInfo.randomWords,
        isClaimed: Boolean(data.moveInfo.isClaimed),
      },
    };
  }
}
