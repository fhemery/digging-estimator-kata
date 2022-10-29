import { DiggingInfo } from "./digging-info";
import { Team } from "./team";

export class DayTeam extends Team {
  static fromDiggingInfo(diggingInfo: DiggingInfo): DayTeam {
    const team = new DayTeam();
    team.miners = team.computeMiners(diggingInfo.digPerDwarfPerRotation, diggingInfo.distanceToDigPerDay);
    team.protectors = team.computeProtectors(diggingInfo.areThereGoblins);
    team.computeOtherDwarves();
    return team;
  }

  computeOtherDwarves() {
    if (this.miners > 0) {
      this.healers = 1;
      this.smithies = 2;
      this.innKeepers = this.computeInnKeepers();
      this.washers = this.computeWashers();
    }
  }
}