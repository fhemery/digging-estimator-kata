import { DiggingEstimator, InvalidFormatException } from "./digging-estimator";
import { RockInformationInterface } from "./rock-information.interface";

export class FakeRockInformationService implements RockInformationInterface {
  get(): number[] {
    return [0, 3, 5.5, 7];
  }
}

describe("digging estimator", () => {
  let estimator: DiggingEstimator;

  beforeEach(() => {
    estimator = new DiggingEstimator(new FakeRockInformationService());
  });

  it("should return as Dr Pockovsky said", () => {
    const result = estimator.tunnel(28, 2, "granite");

    expect(result.total).toBe(48);
  });

  it("should check days and length are positive integers", function() {
    expect(() => estimator.tunnel(-1, 2, "granite")).toThrow(new InvalidFormatException());
    expect(() => estimator.tunnel(2.5, 2, "granite")).toThrow(new InvalidFormatException());
    expect(() => estimator.tunnel(2, -1, "granite")).toThrow(new InvalidFormatException());
    expect(() => estimator.tunnel(2, 5.01, "granite")).toThrow(new InvalidFormatException());
  });
});