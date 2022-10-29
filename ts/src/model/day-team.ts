import { DiggingInfo } from "./digging-info";
import { Team } from "./team";

export class DayTeam extends Team {
  static fromDiggingInfo(diggingInfo: DiggingInfo): DayTeam {
    const team = new DayTeam();
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