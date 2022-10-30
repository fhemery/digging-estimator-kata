import {
  DiggingEstimator,
  InvalidFormatException,
  Team,
  TeamComposition,
  TunnelTooLongForDelayException
} from "./digging-estimator";
import { RockInformationInterface } from "./rock-information.interface";
import { GoblinInformationService } from "./goblin-information-service.interface";

const ONE_DWARF_DIG_PER_ROTATION = 3;
const TWO_DWARVES_DIG_PER_ROTATION = 5.5;
const THREE_DWARVES_DIG_PER_ROTATION = 7;

const MAX_DAY_TEAM = createTeam(3, 1, 2, 0, 8, 0, 0, 2);

function createTeam(miners = 0, healers = 0, smithies = 0, lighters = 0, innKeepers = 0, guards = 0, guardManagers = 0, washers = 0, protectors=0): Team {
  const team = new Team();
  team.miners = miners;
  team.healers = healers;
  team.smithies = smithies;
  team.lighters = lighters;
  team.innKeepers = innKeepers;
  team.guards = guards;
  team.guardManagers = guardManagers;
  team.washers = washers;
  team.protectors = protectors

  return team;
}

export class FakeRockInformationService implements RockInformationInterface {
  get(): number[] {
    return [0, ONE_DWARF_DIG_PER_ROTATION, TWO_DWARVES_DIG_PER_ROTATION, THREE_DWARVES_DIG_PER_ROTATION];
  }
}

const GRANITE = "granite";

class FakeGoblinInformationService implements GoblinInformationService {
  private areThereGoblins = false;

  checkForGoblins() {
    return this.areThereGoblins;
  }

  setGoblinPresence(areThereGoblins: boolean) {
    this.areThereGoblins = areThereGoblins;
  }
}

describe("digging estimator", () => {
  let estimator: DiggingEstimator;
  let fakeGoblinInformationService: FakeGoblinInformationService;

  beforeEach(() => {
    fakeGoblinInformationService = new FakeGoblinInformationService();
    estimator = new DiggingEstimator(new FakeRockInformationService(), fakeGoblinInformationService);
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

  it("should return empty teams if tunnel has no length", function() {
    const result = estimator.tunnel(0, 2, GRANITE);
    const emptyTeam = createTeam();

    expect(result.dayTeam).toEqual(emptyTeam);
    expect(result.nightTeam).toEqual(emptyTeam);
    expect(result.total).toBe(0);
  });

  it("should return empty team if duration is 0", function() {
    expect(() => estimator.tunnel(10, 0, GRANITE)).toThrow(new Error());
  });

  it("should return exception if tunnel is too long to be dug during delay", function() {
    expect(() => estimator.tunnel(30, 2, GRANITE)).toThrow(new TunnelTooLongForDelayException());
  });

  describe(`when there is up to ${ONE_DWARF_DIG_PER_ROTATION} meters to dig`, function() {
    let result: TeamComposition;
    beforeEach(() => {
      const distanceToDig = Math.floor(ONE_DWARF_DIG_PER_ROTATION);

      result = estimator.tunnel(distanceToDig * 2, 2, GRANITE);
    });

    it("should have a day team with one miner", function() {
      const expectedDayTeam = createTeam(1, 1, 2, 0, 4, 0, 0, 1);
      expect(result.dayTeam).toEqual(expectedDayTeam);
    });

    it("should have the correct total", function() {
      expect(result.total).toBe(9);
    });
  });

  describe(`when there is up to ${TWO_DWARVES_DIG_PER_ROTATION} meters to dig`, function() {
    let result: TeamComposition;
    beforeEach(() => {
      const distanceToDig = Math.floor(TWO_DWARVES_DIG_PER_ROTATION);

      result = estimator.tunnel(distanceToDig * 2, 2, GRANITE);
    });

    it("should have a day team with two miners", function() {
      const expectedDayTeam = createTeam(2, 1, 2, 0, 8, 0, 0, 2);
      expect(result.dayTeam).toEqual(expectedDayTeam);
    });

    it("should have the correct total", function() {
      expect(result.total).toBe(15);
    });
  });

  describe(`when there is up to ${THREE_DWARVES_DIG_PER_ROTATION} meters to dig`, function() {
    let result: TeamComposition;
    beforeEach(() => {
      const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION);

      result = estimator.tunnel(distanceToDig * 2, 2, GRANITE);
    });

    it("should have a day team with three miners", function() {
      expect(result.dayTeam).toEqual(MAX_DAY_TEAM);
    });

    it("should have the correct total", function() {
      expect(result.total).toBe(16);
    });
  });

  it(`should not request any night miner for less than ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    const result = estimator.tunnel(Math.floor(THREE_DWARVES_DIG_PER_ROTATION * 3), 3, GRANITE);

    const expectedNightTeam = createTeam(0, 0, 0, 0, 0, 0, 0, 0);

    expect(result.nightTeam).toEqual(expectedNightTeam);
  });

  describe(`when there is up to additional ${ONE_DWARF_DIG_PER_ROTATION} to dig per day`, function() {
    let result: TeamComposition;
    beforeEach(() => {
      const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + ONE_DWARF_DIG_PER_ROTATION);

      result = estimator.tunnel(distanceToDig, 1, GRANITE);
    });
    it("should have max day team", function() {
      expect(result.dayTeam).toEqual(MAX_DAY_TEAM);
    });

    it("should have a night team with one miner", function() {
      const expectedNightTeam = createTeam(1, 1, 2, 2, 8, 3, 1, 2);
      expect(result.nightTeam).toEqual(expectedNightTeam);
    });

    it("should have the correct total", function() {
      expect(result.total).toBe(36);
    });
  });

  describe(`when there is up to additional ${TWO_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    let result: TeamComposition;
    beforeEach(() => {
      const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + TWO_DWARVES_DIG_PER_ROTATION);

      result = estimator.tunnel(distanceToDig, 1, GRANITE);
    });
    it("should have max day team", function() {
      expect(result.dayTeam).toEqual(MAX_DAY_TEAM);
    });

    it("should have a night team with two miners", function() {
      const expectedNightTeam = createTeam(2, 1, 2, 3, 8, 4, 2, 3);
      expect(result.nightTeam).toEqual(expectedNightTeam);
    });

    it("should have the correct total", function() {
      expect(result.total).toBe(41);
    });

  });

  describe(`when there is up to additional ${THREE_DWARVES_DIG_PER_ROTATION} to dig per day`, function() {
    let result: TeamComposition;
    beforeEach(() => {
      const distanceToDig = Math.floor(THREE_DWARVES_DIG_PER_ROTATION + THREE_DWARVES_DIG_PER_ROTATION);

      result = estimator.tunnel(distanceToDig, 1, GRANITE);
    });

    it("should have max day team", function() {
      expect(result.dayTeam).toEqual(MAX_DAY_TEAM);
    });

    it("should have a night team with three miners", function() {
      const expectedNightTeam = createTeam(3, 1, 2, 4, 12, 5, 2, 3);
      expect(result.nightTeam).toEqual(expectedNightTeam);
    });

    it("should have the correct total", function() {
      expect(result.total).toBe(48);
    });

  });

  describe("when there are goblins in the area", function() {
    beforeEach(() => {
      fakeGoblinInformationService.setGoblinPresence(true);
    });

    it("should add 2 protectors to day team", () => {
      const result = estimator.tunnel(ONE_DWARF_DIG_PER_ROTATION, 1, GRANITE, "Moria");

      expect(result.dayTeam.protectors).toBe(2);
    });

    it("should add innkeepers for protectors if needed protectors to team composition total as well", () => {
      const result = estimator.tunnel(ONE_DWARF_DIG_PER_ROTATION, 1, GRANITE, "Moria");

      expect(result.dayTeam.innKeepers).toBe(8);
    });

    it("should add washers if innkeepers or protectors increase requests one", () => {
      const result = estimator.tunnel(ONE_DWARF_DIG_PER_ROTATION, 1, GRANITE, "Moria");

      expect(result.dayTeam.washers).toBe(2);
    });

    it("should add 2 protectors to team composition total as well", () => {
      const result = estimator.tunnel(ONE_DWARF_DIG_PER_ROTATION, 1, GRANITE, "Moria");

      expect(result.total).toBe(16);
    });

    it("should add two protectors to night Team", function() {
      const result = estimator.tunnel(THREE_DWARVES_DIG_PER_ROTATION + ONE_DWARF_DIG_PER_ROTATION, 1, GRANITE, "Moria");

      expect(result.nightTeam.protectors).toBe(2);
    });

    it("should add two lighters for the two protectors", function() {
      const result = estimator.tunnel(THREE_DWARVES_DIG_PER_ROTATION + ONE_DWARF_DIG_PER_ROTATION, 1, GRANITE, "Moria");

      const lightersNeededForMiners = 1;
      const lightersNeededForRestOfCamp = 1;
      const lightersNeededForProtectors = 2;
      expect(result.nightTeam.lighters).toBe(lightersNeededForMiners + lightersNeededForProtectors + lightersNeededForRestOfCamp);
    });

    it('should impact the number of innkeepers for the night team', function() {
      const result = estimator.tunnel(Math.floor(THREE_DWARVES_DIG_PER_ROTATION + TWO_DWARVES_DIG_PER_ROTATION), 1, GRANITE, "Moria");

      expect(result.nightTeam.innKeepers).toBe(12);
    });

    it('should impact the number of washers for the night team', function() {
      const result = estimator.tunnel(THREE_DWARVES_DIG_PER_ROTATION + THREE_DWARVES_DIG_PER_ROTATION, 1, GRANITE, "Moria");

      expect(result.nightTeam.washers).toBe(4);
    });

    it("should impact the total for the night team", function() {
      const result = estimator.tunnel(THREE_DWARVES_DIG_PER_ROTATION + THREE_DWARVES_DIG_PER_ROTATION, 1, GRANITE, "Moria");
      const expectedDayTeam = createTeam(3,1,2,0,8,0,0,2,2);
      const expectedNightTeam = createTeam(3,1,2,6,16,6,2,4,2);
      const expectedDayTeamSize = 18;
      const expectedNightTeamSize = 42;

      expect(result).toEqual(new TeamComposition(expectedDayTeam, expectedNightTeam))
      expect(result.total).toBe(expectedDayTeamSize + expectedNightTeamSize);
    });
  });

  describe("when not using the fake implementation for the RockInformationService", function() {
    it("should fail", function() {
      const realEstimator = new DiggingEstimator();
      expect(() => realEstimator.tunnel(2, 1, GRANITE)).toThrow();
    });
  });
});