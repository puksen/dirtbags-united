export interface Tick {
  id: number;
  date: string;
  routeName: string;
  cragName: string;
  sectorName: string;
  grade: string;
  tickType: "Rotpunkt" | "Flash" | "Onsight" | "Toprope" | "Go";
  rating?: number;
  notes?: string;
}
