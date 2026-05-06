import type { Route } from "./route";
import type { Sector } from "./sector";

export interface Crag {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  parkingLongitude?: number;
  parkingLatitude?: number;
  description?: string;
  sectors?: Sector[];
  routes?: Route[];
  approachTime?: number; // in minutes
}
