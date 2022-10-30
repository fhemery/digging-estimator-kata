import { GoblinInformationService } from "../goblin-information-service.interface";
import { Communication } from "./communication.interface";
import { VinCommunicationService } from "./vin-communication.service";

export class VinGoblinInformationService implements GoblinInformationService {
  private readonly communicationService;

  constructor(communicationService?: Communication) {
    this.communicationService = communicationService || new VinCommunicationService();
  }

  checkForGoblins(area: string): boolean {
    const url = `dtp://research.vin.co/are-there-goblins/${area}`;
    return this.communicationService.get<boolean>(url);
  }
}