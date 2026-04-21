import type { Crag } from "../domain/crag";

export default function CragPopup({ crag }: { crag: Crag }) {
  const routeCount = crag.routes.length;
  const routeDifficultyArray = crag.routes.map((route) => route.grade);
  return (
    <a href={`/crags/${crag.id}`} className="block">
      <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-700 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-800">{crag.name}</h3>
        <p className="mt-1 text-stone-600">{routeCount} Routen</p>
        <p className="mt-2 text-stone-600">
          Schwierigkeiten: {routeDifficultyArray.join(", ")}
        </p>
      </div>
    </a>
  );
}
