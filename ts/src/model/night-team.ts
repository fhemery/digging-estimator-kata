import { DiggingInfo } from "./digging-info";
import { Team } from "./team";

export class NightTeam extends Team {
  static fromDiggingInfo(diggingInfo: DiggingInfo): NightTeam {
    const team = new NightTeam();
    team.miners = team.computeMiners(diggingInfo.digPerDwarfPerRotation, diggingInfo.distanceToDigPerDay - diggingInfo.maxDiggingDistancePerRotation);
    team.protectors = team.computeProtectors(diggingInfo.areThereGoblins);
    team.computeOtherDwarves();
    return team;
  }

  computeOtherDwarves() {
    if (this.miners > 0) {
      this.healers = 1;
      this.smithies = 2;

      this.lighters = this.miners + 1;

      this.innKeepers = this.computeInnKeepers();

      this.computeDependantDwarves();
      this.computeDependantDwarves();
    }
  }

  private computeDependantDwarves() {
    let iterationsNeededToStabilizeCount = 2;
    while (iterationsNeededToStabilizeCount-- > 0) {
      this.washers = this.computeWashers();
      this.guards = this.computeGuards();
      this.guardManagers = this.computeGuardManagers();
    }
  }
}