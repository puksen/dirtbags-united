import type { Route } from "./route";

export interface Sector {
  id: string;
  name: string;
  cragId: string;
  routes?: Route[];
}
