import { DiggingEstimator, InvalidFormatException, TunnelTooLongForDelayException } from "./digging-estimator";
import { RockInformationInterface } from "./rock-information.interface";

const ONE_DWARF_DIG_PER_ROTATION = 3
const TWO_DWARVES_DIG_PER_ROTATION = 5.5
const THREE_DWARVES_DIG_PER_ROTATION = 7

export class FakeRockInformationService implements RockInformationInterface {
  get(): number[] {
    return [0, ONE_DWARF_DIG_PER_ROTATION, TWO_DWARVES_DIG_PER_ROTATION, THREE_DWARVES_DIG_PER_ROTATION];
  }
}
const GRANITE = "granite";

describe("digging estimator", () => {
  let estimator: DiggingEstimator;

  beforeEach(() => {
    estimator = new DiggingEstimator(new FakeRockInformationService());
  });

  it("should return as Dr Pockovsky said", () => {
    const result = estimator.tunnel(28, 2, GRANITE);

    expect(result.total).toBe(48);
  });

  it("should check days and length are positive integers", function() {
    expect(() => estimator.tunnel(-1, 2, GRANITE)).toThrow(new InvalidFormatException());
    expect(() => estimator.tunnel(2.5, 2, GRANITE)).toThrow(new InvalidFormatException());
    expect(() => estimator.tunnel(2, -1, GRANITE)).toThrow(new InvalidFormatException());
    expect(() => estimator.tunnel(2, 5.01, GRANITE)).toThrow(new InvalidFormatException());
  });

  it("should return exception if tunnel is too long to be dug during delay", function() {
    expect(() => estimator.tunnel(30, 2, GRANITE)).toThrow(new TunnelTooLongForDelayException());
  });

  it(`should request one day miner when there is note more than 3 meters to dig`, function() {
    const result = estimator.tunnel(ONE_DWARF_DIG_PER_ROTATION * 2, 2, GRANITE);

    expect(result.dayTeam.miners).toBe(1);
  });

  it(`should request two day miners for ${TWO_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const result = estimator.tunnel(Math.floor(TWO_DWARVES_DIG_PER_ROTATION * 3), 3, GRANITE);

    expect(result.dayTeam.miners).toBe(2);
  });

  it(`should request three day miners for ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const result = estimator.tunnel(Math.floor(THREE_DWARVES_DIG_PER_ROTATION * 3), 3, GRANITE);

    expect(result.dayTeam.miners).toBe(3);
  });

  it(`should not request any night miner for less than ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const result = estimator.tunnel(Math.floor(THREE_DWARVES_DIG_PER_ROTATION * 3), 3, GRANITE);

    expect(result.nightTeam.miners).toBe(0);
  });

  it(`should request one night miner for additional ${ONE_DWARF_DIG_PER_ROTATION} to dig per day`, function() {
    const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + ONE_DWARF_DIG_PER_ROTATION);

    const result = estimator.tunnel(distanceToDig , 1, GRANITE);

    expect(result.nightTeam.miners).toBe(1);
  });

  it(`should request two night miners for additional ${TWO_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + TWO_DWARVES_DIG_PER_ROTATION);

    const result = estimator.tunnel(distanceToDig , 1, GRANITE);

    expect(result.nightTeam.miners).toBe(2);
  });

  it(`should request three night miners for additional ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + THREE_DWARVES_DIG_PER_ROTATION);

    const result = estimator.tunnel(distanceToDig , 1, GRANITE);

    expect(result.nightTeam.miners).toBe(3);
  });
});