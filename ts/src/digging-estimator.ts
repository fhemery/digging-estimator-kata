import { RockInformationInterface } from "./rock-information.interface";
import { VinRockInformationService } from "./external/vin-rock-information.service";

export class TunnelTooLongForDelayException extends Error {
}

export class InvalidFormatException extends Error {
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
}

export class DayTeam extends Team {
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
}

export class TeamComposition {
  dayTeam: DayTeam = new DayTeam();
  nightTeam: NightTeam = new NightTeam();

  get total(): number {
    return this.dayTeam.total + this.nightTeam.total;
  }
}

export class DiggingEstimator {
  private readonly rockInformation: RockInformationInterface;

  constructor(rockInformation?: RockInformationInterface) {
    this.rockInformation = rockInformation || new VinRockInformationService()
  }

  tunnel(length: number, days: number, rockType: string): TeamComposition {
    const digPerRotation = this.rockInformation.get(rockType);
    const maxDigPerRotation = digPerRotation[digPerRotation.length - 1];
    const maxDigPerDay = 2 * maxDigPerRotation;

    if (Math.floor(length) !== length || Math.floor(days) !== days || length < 0 || days < 0) {
      throw new InvalidFormatException();
    }

    const distanceToDigPerDay = Math.floor(length / days);
    if (distanceToDigPerDay > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }

    const composition = new TeamComposition();
    const {dayTeam, nightTeam} = composition;

    dayTeam.miners = this.computeMiners(digPerRotation, distanceToDigPerDay);
    nightTeam.miners = this.computeMiners(digPerRotation, distanceToDigPerDay - maxDigPerRotation);

    dayTeam.computeOtherDwarves();
    nightTeam.computeOtherDwarves();

    return composition;
  }

  private computeMiners(digPerRotation: number[], distanceToDigPerDay: number) {
    let miners = 0;
    for (let i = 0; i < digPerRotation.length - 1; ++i) {
      if (digPerRotation[i] < distanceToDigPerDay) {
        miners++;
      }
    }
    return miners;
  }
}
