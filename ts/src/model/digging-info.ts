export class DiggingInfo {
  readonly distanceToDigPerDay;
  readonly maxDiggingDistancePerRotation;

  constructor(readonly lengthToDig: number, readonly daysAvailable: number, readonly digPerDwarfPerRotation: number[], readonly areThereGoblins: boolean) {
    this.distanceToDigPerDay = Math.floor(lengthToDig / daysAvailable);
    this.maxDiggingDistancePerRotation = digPerDwarfPerRotation.at(-1) || 0;
  }
}