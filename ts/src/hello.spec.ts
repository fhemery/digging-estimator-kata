import { hello } from "./hello";

describe("kata", function () {
  it("should work", () => {
    expect(1 + 2).toBe(3);
  });

  it("should fail", () => {
    expect(hello()).toBe("Hello world!");
  });
});
