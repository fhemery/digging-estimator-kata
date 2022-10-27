import { DiggingEstimator } from "./digging-estimator";
import { RockInformationInterface } from "./rock-information.interface";

export class FakeRockInformationService implements RockInformationInterface {
  get(): number[] {
    return [0, 3, 5.5, 7];
  }
}

describe("digging estimator", () => {
  it("should return as Dr Pockovsky said", () => {
    const estimator = new DiggingEstimator(new FakeRockInformationService());

    const result = estimator.tunnel(28, 2, "granite");

    expect(result.total).toBe(48);
  });
});