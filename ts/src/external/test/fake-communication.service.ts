import { Communication } from "../communication.interface";

export class FakeCommunicationService implements Communication {
  calledUrl = "";

  get<T>(url: string) {
    this.calledUrl = url;
    return true as T;
  }
}