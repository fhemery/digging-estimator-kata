export interface Communication {
  get<T>(url: string): T;
}