import { RockInformationInterface } from "./rock-information.interface";
import { VinRockInformationService } from "./external/vin-rock-information.service";

const NB_ROTATIONS_PER_DAY = 2

export class TunnelTooLongForDelayException extends Error {
}

export class InvalidFormatException extends Error {
}

export class DiggingInfo {
  readonly distanceToDigPerDay;
  readonly maxDiggingDistancePerRotation;
  constructor(readonly lengthToDig: number, readonly daysAvailable: number, readonly digPerDwarfPerRotation: number[]) {
    this.distanceToDigPerDay = Math.floor(lengthToDig / daysAvailable);
    this.maxDiggingDistancePerRotation = digPerDwarfPerRotation.at(-1) || 0;
  }
}

export class Team {
  miners = 0;
  healers = 0;
  smithies = 0;
  lighters = 0;
  innKeepers = 0;
  guards = 0;
  guardManagers = 0;
  washers = 0;

  get total(): number {
    return this.miners + this.washers +  this.healers  + this.smithies  + this.innKeepers + this.guards + this.guardManagers + this.lighters;
  }

  protected computeMiners(digPerRotation: number[], distanceToDigPerDay: number) {
    let miners = 0;
    for (let i = 0; i < digPerRotation.length - 1; ++i) {
      if (digPerRotation[i] < distanceToDigPerDay) {
        miners++;
      }
    }
    return miners;
  }

}

export class DayTeam extends Team {
  static fromDiggingInfo(diggingInfo: DiggingInfo): DayTeam {
    const team = new DayTeam()
    team.miners = team.computeMiners(diggingInfo.digPerDwarfPerRotation, diggingInfo.distanceToDigPerDay);
    team.computeOtherDwarves();
    return team;
  }

  computeOtherDwarves() {
    if (this.miners > 0) {
      this.healers = 1;
      this.smithies = 2;
      this.innKeepers = Math.ceil((this.miners + this.healers + this.smithies) / 4) * 4;
      this.washers = Math.ceil((this.miners + this.healers + this.smithies + this.innKeepers) / 10);
    }
  }
}

export class NightTeam extends Team {
  computeOtherDwarves() {
    if (this.miners > 0) {
      this.healers = 1;
      this.smithies = 2;

      this.lighters = this.miners + 1;

      this.innKeepers = Math.ceil((this.miners + this.healers + this.smithies + this.lighters) / 4) * 4;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const oldWashers = this.washers;
        const oldGuard = this.guards;
        const oldGuardManagers = this.guardManagers;

        this.washers = Math.ceil((this.miners + this.healers + this.smithies + this.innKeepers + this.lighters + this.guards + this.guardManagers) / 10);
        this.guards = Math.ceil((this.healers + this.miners + this.smithies + this.lighters + this.washers) / 3);
        this.guardManagers = Math.ceil((this.guards) / 3);

        if (oldWashers === this.washers && oldGuard === this.guards && oldGuardManagers === this.guardManagers) {
          break;
        }
      }
    }
  }

  static fromDiggingInfo(diggingInfo: DiggingInfo): NightTeam {
    const team = new NightTeam()
    team.miners = team.computeMiners(diggingInfo.digPerDwarfPerRotation, diggingInfo.distanceToDigPerDay - diggingInfo.maxDiggingDistancePerRotation);
    team.computeOtherDwarves();
    return team;
  }
}

export class TeamComposition {
  constructor(readonly dayTeam = new DayTeam(), readonly nightTeam = new NightTeam()) {
  }

  get total(): number {
    return this.dayTeam.total + this.nightTeam.total;
  }

  static fromDiggingInfo(diggingInfo: DiggingInfo): TeamComposition {
    const dayTeam = DayTeam.fromDiggingInfo(diggingInfo);
    const nightTeam = NightTeam.fromDiggingInfo(diggingInfo);

    return new TeamComposition(dayTeam, nightTeam);
  }
}

export class DiggingEstimator {
  private readonly rockInformation: RockInformationInterface;

  constructor(rockInformation?: RockInformationInterface) {
    this.rockInformation = rockInformation || new VinRockInformationService()
  }

  tunnel(length: number, days: number, rockType: string): TeamComposition {
    this.checkInputs(length, days);

    const diggingInfo = new DiggingInfo(length, days, this.rockInformation.get(rockType))

    if (diggingInfo.distanceToDigPerDay > NB_ROTATIONS_PER_DAY * diggingInfo.maxDiggingDistancePerRotation) {
      throw new TunnelTooLongForDelayException();
    }

    return TeamComposition.fromDiggingInfo(diggingInfo);
  }

  private checkInputs(length: number, days: number) {
    if (Math.floor(length) !== length || Math.floor(days) !== days || length < 0 || days < 0) {
      throw new InvalidFormatException();
    }
  }
}
