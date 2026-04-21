import type { Sector } from "./sector";

export interface Route {
  id: string;
  name: string;
  grade: string;
  cragId: string;
  sector?: Sector;
  description?: string;
}
