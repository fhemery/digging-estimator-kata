import { RockInformationInterface } from "./rock-information.interface";
import { VinRockInformationService } from "./external/vin-rock-information.service";
import { DiggingInfo } from "./model/digging-info";
import { TeamComposition } from "./model/team-composition";

export { Team } from "./model/team";
export { TeamComposition } from "./model/team-composition";


const NB_ROTATIONS_PER_DAY = 2

export class TunnelTooLongForDelayException extends Error {
}

export class InvalidFormatException extends Error {
}

export class DiggingEstimator {
  private readonly rockInformation: RockInformationInterface;

  constructor(rockInformation?: RockInformationInterface) {
    this.rockInformation = rockInformation || new VinRockInformationService()
  }

  tunnel(length: number, days: number, rockType: string): TeamComposition {
    this.checkInputs(length, days);

    const diggingInfo = new DiggingInfo(length, days, this.rockInformation.get(rockType))

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
