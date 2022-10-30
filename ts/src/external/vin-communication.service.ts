import { Communication } from "./communication.interface";

export class VinCommunicationService implements Communication{
  get<T>(url: string): T {
    console.log(`Tried to fetch ${url}`);
    throw new Error('Does not work in test mode');
  }
}