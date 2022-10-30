import { RockInformationInterface } from "./rock-information.interface";
import { VinRockInformationService } from "./external/vin-rock-information.service";
import { DiggingInfo } from "./model/digging-info";
import { TeamComposition } from "./model/team-composition";
import { GoblinInformationService } from "./goblin-information-service.interface";
import { VinGoblinInformationService } from "./external/vin-goblin-information-service";

export { Team } from "./model/team";
export { TeamComposition } from "./model/team-composition";


const NB_ROTATIONS_PER_DAY = 2

export class TunnelTooLongForDelayException extends Error {
}

export class InvalidFormatException extends Error {
}

export class DiggingEstimator {
  private readonly rockInformation: RockInformationInterface;
  private readonly goblinInformation: GoblinInformationService;

  constructor(rockInformation?: RockInformationInterface, goblinInformation?: GoblinInformationService) {
    this.rockInformation = rockInformation || new VinRockInformationService()
    this.goblinInformation = goblinInformation || new VinGoblinInformationService();
  }

  tunnel(length: number, days: number, rockType: string, location = ""): TeamComposition {
    this.checkInputs(length, days);

    const areThereGoblins = location ? this.goblinInformation.checkForGoblins(location) : false
    const diggingInfo = new DiggingInfo(length, days, this.rockInformation.get(rockType), areThereGoblins)

    this.checkTunnelCanBeDugInRequestedTime(diggingInfo);

    return TeamComposition.fromDiggingInfo(diggingInfo);
  }

  private checkTunnelCanBeDugInRequestedTime(diggingInfo: DiggingInfo) {
    if (diggingInfo.distanceToDigPerDay > NB_ROTATIONS_PER_DAY * diggingInfo.maxDiggingDistancePerRotation) {
      throw new TunnelTooLongForDelayException();
    }
  }

  private checkInputs(length: number, days: number) {
    if (Math.floor(length) !== length || Math.floor(days) !== days || length < 0 || days < 0) {
      throw new InvalidFormatException();
    }
  }
}
