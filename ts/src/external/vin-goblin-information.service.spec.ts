import { VinGoblinInformationService } from "./vin-goblin-information.service";
import { FakeCommunicationService } from "./test/fake-communication.service";


describe("VinGoblinInformationService", function() {
  it("should call the communication service with correct url", function() {
    const communicationService = new FakeCommunicationService();
    const service = new VinGoblinInformationService(communicationService);
    service.checkForGoblins("Moria");

    expect(communicationService.calledUrl).toBe('dtp://research.vin.co/are-there-goblins/Moria');
  });

  it("should throw an error when called with default communication service", function() {
    const service = new VinGoblinInformationService();

    expect(() => service.checkForGoblins("Moria")).toThrow();
  });
});