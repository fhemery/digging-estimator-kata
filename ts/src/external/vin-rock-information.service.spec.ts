import { FakeCommunicationService } from "./test/fake-communication.service";
import { VinRockInformationService } from "./vin-rock-information.service";

describe("VinRockInformationService", function() {
  it("should call the communication service with correct url", function() {
    const communicationService = new FakeCommunicationService();
    const service = new VinRockInformationService(communicationService);
    service.get("Granite");

    expect(communicationService.calledUrl).toBe('dtp://research.vin.co/digging-rate/Granite');
  });

  it("should throw an error when called with default communication service", function() {
    const service = new VinRockInformationService();

    expect(() => service.get("granite")).toThrow();
  });
});