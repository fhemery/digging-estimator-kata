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
}

export class TeamComposition {
  dayTeam: Team = new Team();
  nightTeam: Team = new Team();

  total = 0;
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
    if (Math.floor(length / days) > maxDigPerDay) {
      throw new TunnelTooLongForDelayException();
    }
    const composition = new TeamComposition();

    // Miners
    for (let i = 0; i < digPerRotation.length - 1; ++i) {
      if (digPerRotation[i] < Math.floor(length / days)) {
        composition.dayTeam.miners++;
      }
    }
    if (Math.floor(length / days) > maxDigPerRotation) {
      for (let i = 0; i < digPerRotation.length - 1; ++i) {
        if (digPerRotation[i] + maxDigPerRotation < Math.floor(length / days)) {
          composition.nightTeam.miners++;
        }
      }
    }
    const dt = composition.dayTeam;
    const nt = composition.nightTeam;

    if (dt.miners > 0) {
      ++dt.healers;
      ++dt.smithies;
      ++dt.smithies;
    }

    if (nt.miners > 0) {
      ++nt.healers;
      ++nt.smithies;
      ++nt.smithies;
    }

    if (nt.miners > 0) {
      nt.lighters = nt.miners + 1;
    }

    if (dt.miners > 0) {
      dt.innKeepers = Math.ceil((dt.miners + dt.healers + dt.smithies) / 4) * 4;
      dt.washers = Math.ceil((dt.miners + dt.healers + dt.smithies + dt.innKeepers) / 10);
    }

    if (nt.miners > 0) {
      nt.innKeepers = Math.ceil((nt.miners + nt.healers + nt.smithies + nt.lighters) / 4) * 4;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const oldWashers = nt.washers;
      const oldGuard = nt.guards;
      const oldChiefGuard = nt.guardManagers;

      nt.washers = Math.ceil((nt.miners + nt.healers + nt.smithies + nt.innKeepers + nt.lighters + nt.guards + nt.guardManagers) / 10);
      nt.guards = Math.ceil((nt.healers + nt.miners + nt.smithies + nt.lighters + nt.washers) / 3);
      nt.guardManagers = Math.ceil((nt.guards) / 3);

      if (oldWashers === nt.washers && oldGuard === nt.guards && oldChiefGuard === nt.guardManagers) {
        break;
      }
    }

    composition.total = dt.miners + dt.washers + dt.healers + dt.smithies + dt.innKeepers +
      nt.miners + nt.washers +  nt.healers  + nt.smithies  + nt.innKeepers + nt.guards + nt.guardManagers + nt.lighters;
    return composition;
  }
}
