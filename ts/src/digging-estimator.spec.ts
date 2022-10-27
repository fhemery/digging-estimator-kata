import { DiggingEstimator, InvalidFormatException, Team, TunnelTooLongForDelayException } from "./digging-estimator";
import { RockInformationInterface } from "./rock-information.interface";

const ONE_DWARF_DIG_PER_ROTATION = 3;
const TWO_DWARVES_DIG_PER_ROTATION = 5.5;
const THREE_DWARVES_DIG_PER_ROTATION = 7;

const MAX_DAY_TEAM = createTeam(3, 1, 2, 0, 8, 0, 0, 2);

function createTeam(miners = 0, healers = 0, smithies = 0, lighters = 0, innKeepers = 0, guards = 0, guardManagers = 0, washers = 0): Team {
  const team = new Team();
  team.miners = miners;
  team.healers = healers;
  team.smithies = smithies;
  team.lighters = lighters;
  team.innKeepers = innKeepers;
  team.guards = guards;
  team.guardManagers = guardManagers;
  team.washers = washers;

  return team;
}

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

  it(`should request one day miner + according team when there is note more than 3 meters to dig`, function() {
    const result = estimator.tunnel(ONE_DWARF_DIG_PER_ROTATION * 2, 2, GRANITE);

    const expectedDayTeam = createTeam(1, 1, 2, 0, 4, 0, 0, 1);

    expect(result.dayTeam).toEqual(expectedDayTeam);
  });

  it(`should request two day miners + according team for ${TWO_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const result = estimator.tunnel(Math.floor(TWO_DWARVES_DIG_PER_ROTATION * 3), 3, GRANITE);

    const expectedDayTeam = createTeam(2, 1, 2, 0, 8, 0, 0, 2);

    expect(result.dayTeam).toEqual(expectedDayTeam);
  });

  it(`should request three day miners + according team for ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const result = estimator.tunnel(Math.floor(THREE_DWARVES_DIG_PER_ROTATION * 3), 3, GRANITE);

    expect(result.dayTeam).toEqual(MAX_DAY_TEAM);
  });

  it(`should not request any night miner for less than ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const result = estimator.tunnel(Math.floor(THREE_DWARVES_DIG_PER_ROTATION * 3), 3, GRANITE);

    const expectedNightTeam = createTeam(0, 0, 0, 0, 0, 0, 0, 0);

    expect(result.nightTeam).toEqual(expectedNightTeam);
  });

  it(`should request one night miner for additional ${ONE_DWARF_DIG_PER_ROTATION} to dig per day`, function() {
    const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + ONE_DWARF_DIG_PER_ROTATION);

    const result = estimator.tunnel(distanceToDig, 1, GRANITE);

    const expectedNightTeam = createTeam(1, 1, 2, 2, 8, 3, 1, 2);

    expect(result.dayTeam).toEqual(MAX_DAY_TEAM)
    expect(result.nightTeam).toEqual(expectedNightTeam);
  });

  it(`should request two night miners for additional ${TWO_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + TWO_DWARVES_DIG_PER_ROTATION);

    const result = estimator.tunnel(distanceToDig, 1, GRANITE);

    const expectedNightTeam = createTeam(2, 1, 2, 3, 8, 4, 2, 3);

    expect(result.dayTeam).toEqual(MAX_DAY_TEAM)
    expect(result.nightTeam).toEqual(expectedNightTeam);
  });

  it(`should request three night miners for additional ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + THREE_DWARVES_DIG_PER_ROTATION);

    const result = estimator.tunnel(distanceToDig, 1, GRANITE);

    const expectedNightTeam = createTeam(3, 1, 2, 4, 12, 5, 2, 3);

    expect(result.dayTeam).toEqual(MAX_DAY_TEAM)
    expect(result.nightTeam).toEqual(expectedNightTeam);
  });
});