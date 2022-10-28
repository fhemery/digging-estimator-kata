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

export class TeamComposition {
  dayTeam: Team = new Team();
  nightTeam: Team = new Team();

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

    // Miners
    for (let i = 0; i < digPerRotation.length - 1; ++i) {
      if (digPerRotation[i] < distanceToDigPerDay) {
        composition.dayTeam.miners++;
      }
    }
    if (distanceToDigPerDay > maxDigPerRotation) {
      for (let i = 0; i < digPerRotation.length - 1; ++i) {
        if (digPerRotation[i] + maxDigPerRotation < distanceToDigPerDay) {
          composition.nightTeam.miners++;
        }
      }
    }
    const {dayTeam, nightTeam} = composition;

    if (dayTeam.miners > 0) {
      dayTeam.healers = 1;
      dayTeam.smithies = 2;
      dayTeam.innKeepers = Math.ceil((dayTeam.miners + dayTeam.healers + dayTeam.smithies) / 4) * 4;
      dayTeam.washers = Math.ceil((dayTeam.miners + dayTeam.healers + dayTeam.smithies + dayTeam.innKeepers) / 10);
    }

    if (nightTeam.miners > 0) {
      nightTeam.healers = 1;
      nightTeam.smithies = 2;

      nightTeam.lighters = nightTeam.miners + 1;

      nightTeam.innKeepers = Math.ceil((nightTeam.miners + nightTeam.healers + nightTeam.smithies + nightTeam.lighters) / 4) * 4;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const oldWashers = nightTeam.washers;
        const oldGuard = nightTeam.guards;
        const oldGuardManagers = nightTeam.guardManagers;

        nightTeam.washers = Math.ceil((nightTeam.miners + nightTeam.healers + nightTeam.smithies + nightTeam.innKeepers + nightTeam.lighters + nightTeam.guards + nightTeam.guardManagers) / 10);
        nightTeam.guards = Math.ceil((nightTeam.healers + nightTeam.miners + nightTeam.smithies + nightTeam.lighters + nightTeam.washers) / 3);
        nightTeam.guardManagers = Math.ceil((nightTeam.guards) / 3);

        if (oldWashers === nightTeam.washers && oldGuard === nightTeam.guards && oldGuardManagers === nightTeam.guardManagers) {
          break;
        }
      }
    }

    return composition;
  }
}
