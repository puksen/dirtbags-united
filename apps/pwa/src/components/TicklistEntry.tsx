export type TickType = "Rotpunkt" | "Flash" | "Onsight" | "Toprope" | "Go";

export interface LogEntry {
  id: number;
  date: string;
  routeName: string;
  cragName: string;
  sectorName: string;
  grade: string;
  tickType: TickType;
  rating?: number;
  notes?: string;
}

const tickTypeColors = {
  Rotpunkt: "bg-red-500/20 text-red-600 inset-ring inset-ring-red-500/20",
  Flash: "bg-yellow-500/20 text-yellow-600 inset-ring inset-ring-yellow-500/20",
  Onsight: "bg-purple-500/20 text-purple-600 inset-ring inset-ring-purple-500/20",
  Toprope: "bg-blue-500/20 text-blue-600 inset-ring inset-ring-blue-500/20",
  Go: "bg-green-500/20 text-green-600 inset-ring inset-ring-green-500/20",
};

export default function TicklistEntry({ entry }: { entry: LogEntry }) {
    return(

        <div
            key={entry.id}
                className="bg-stone-50 rounded-lg shadow-sm border border-stone-200 p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-stone-900 font-medium flex-1">{entry.routeName}</h3>
                  <span className="px-2 py-1 bg-stone-200 text-stone-900 rounded-full text-xs font-medium">
                    {entry.grade}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tickTypeColors[entry.tickType]}`}>
                    {entry.tickType}
                  </span>
                </div>

                <p className="text-xs text-stone-500">
                  {new Date(entry.date).toLocaleDateString('de-DE', { 
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })} • {entry.cragName}
                </p>
              </div>
    )
}