const NEEDED_PROTECTORS = 2;

export class Team {
  miners = 0;
  healers = 0;
  smithies = 0;
  lighters = 0;
  innKeepers = 0;
  guards = 0;
  guardManagers = 0;
  washers = 0;
  protectors = 0;

  get total(): number {
    return this.miners + this.washers + this.healers + this.smithies + this.innKeepers + this.guards + this.guardManagers + this.lighters;
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

  protected computeProtectors(areThereGoblins: boolean): number {
    return areThereGoblins ? NEEDED_PROTECTORS : 0;
  }
}