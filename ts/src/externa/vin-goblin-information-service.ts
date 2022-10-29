import { GoblinInformationService } from "../goblin-information-service.interface";

export class VinGoblinInformationService implements GoblinInformationService {
  checkForGoblins(area: string): boolean {
    return false;
  }
}