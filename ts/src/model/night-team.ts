import { DiggingInfo } from "./digging-info";
import { Team } from "./team";

export class NightTeam extends Team {
  static fromDiggingInfo(diggingInfo: DiggingInfo): NightTeam {
    const team = new NightTeam();
    team.miners = team.computeMiners(diggingInfo.digPerDwarfPerRotation, diggingInfo.distanceToDigPerDay - diggingInfo.maxDiggingDistancePerRotation);
    team.computeOtherDwarves();
    return team;
  }

  computeOtherDwarves() {
    if (this.miners > 0) {
      this.healers = 1;
      this.smithies = 2;

      this.lighters = this.miners + 1;

      this.innKeepers = Math.ceil((this.miners + this.healers + this.smithies + this.lighters) / 4) * 4;

      this.computeDependantDwarves();
      this.computeDependantDwarves();
    }
  }

  private computeDependantDwarves() {
    let iterationsNeededToStabilizeCount = 2;
    while (iterationsNeededToStabilizeCount-- > 0) {
      this.washers = Math.ceil((this.miners + this.healers + this.smithies + this.innKeepers + this.lighters + this.guards + this.guardManagers) / 10);
      this.guards = Math.ceil((this.healers + this.miners + this.smithies + this.lighters + this.washers) / 3);
      this.guardManagers = Math.ceil((this.guards) / 3);
    }
  }
}