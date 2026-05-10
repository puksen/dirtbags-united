import {
  MagnifyingGlassIcon,
  FunnelIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function MapSearchBar() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-stone-100 px-3 py-2 flex items-center gap-2 border-b border-stone-200 relative z-[999]">
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Felsen suchen..."
          value={searchQuery}
          onChange={(e) => {
            console.log(
              "Search query:",
              e.target.value,
              "searchQuery state:",
              searchQuery,
            );
            setSearchQuery(e.target.value);
          }}
          className="w-full pl-10 pr-3 py-2.5 bg-stone-200/70 text-stone-900 placeholder:text-stone-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#d97f3a]/50 transition-all"
          style={{ minHeight: "44px" }}
        />
      </div>

      <button
        onClick={() => {
          console.log("Filter button clicked");
          setShowFilters((prev) => !prev);
        }}
        className={`flex items-center justify-center p-2.5 rounded-full transition-all shadow-sm ${
          showFilters
            ? "bg-[#d97f3a] text-stone-50"
            : "bg-stone-200/70 text-stone-700 hover:bg-stone-300/70"
        }`}
        style={{ minWidth: "44px", minHeight: "44px" }}
        aria-label="Filter"
      >
        <FunnelIcon className="w-5 h-5" />
      </button>

      <button
        onClick={() => console.log("View toggle button clicked")}
        className="flex items-center justify-center p-2.5 rounded-full transition-all shadow-sm bg-stone-200/70 text-stone-700 hover:bg-stone-300/70"
        style={{ minWidth: "44px", minHeight: "44px" }}
      >
        <QueueListIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
