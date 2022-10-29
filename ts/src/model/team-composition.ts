import { DayTeam } from "./day-team";
import { NightTeam } from "./night-team";
import { DiggingInfo } from "./digging-info";
import { Team } from "./team";

export class TeamComposition {
  constructor(readonly dayTeam: Team = new DayTeam(), readonly nightTeam: Team = new NightTeam()) {
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