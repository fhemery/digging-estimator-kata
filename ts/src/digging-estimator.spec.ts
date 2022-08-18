import { DiggingEstimator } from "./digging-estimator";

describe("digging estimator", () => {

  it("should return as Dr Pockovsky said", () => {
    // To have it work, you need to go set the rates to [0, 3, 5.5, 7]
    const estimator = new DiggingEstimator();

    const result = estimator.tunnel(28, 2, "granite");

    expect(result.total).toBe(48);
  });
});