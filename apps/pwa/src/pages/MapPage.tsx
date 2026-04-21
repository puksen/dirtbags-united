import MapLibre from "../components/MapLibre";
import type { Crag } from "../domain/crag";
import type { Route } from "../domain/route";

const center: [number, number] = [11.1, 49.9];

const routes: Route[] = [
  {
    id: "1",
    name: "Route 1",
    grade: "6a",
    cragId: "1",
  },
  {
    id: "2",
    name: "Route 2",
    grade: "6b",
    cragId: "1",
  },
  {
    id: "3",
    name: "Route 3",
    grade: "6c",
    cragId: "2",
  },
];

const crags: Crag[] = [
  {
    id: "1",
    name: "Herzogenreuther Wand",
    latitude: 49.9146,
    longitude: 11.0882,
    routes: [routes[0], routes[1]],
  },
  {
    id: "2",
    name: "Stahlberg",
    latitude: 49.7059,
    longitude: 11.2384,
    routes: [routes[2]],
  },
];

export default function MapPage() {
  return (
    <div className="h-full min-h-0 w-full">
      <MapLibre initialCenter={center} crags={crags} />
    </div>
  );
}
