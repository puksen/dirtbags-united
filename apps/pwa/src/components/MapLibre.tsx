// import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-theme/icons.default.css";
import "maplibre-theme/modern.css";

// we needed this for the RGradientMap component
import "maplibre-react-components/style.css";
import {
  RMap,
  RNavigationControl,
  RGradientMarker,
  RGeolocateControl,
  RPopup,
  gradientMarkerPopupOffset,
} from "maplibre-react-components";
import { Fragment, useState } from "react";
import type { Crag } from "../domain/crag";
import CragPopup from "./CragPopup";

type MapLibreProps = {
  initialCenter: [number, number];
  crags?: Crag[];
};

export default function MapLibre({ initialCenter, crags }: MapLibreProps) {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  return (
    <RMap
      minZoom={6}
      initialCenter={initialCenter}
      initialZoom={8}
      initialAttributionControl={false}
      mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
      style={{ width: "100%", height: "100%" }}
    >
      <RGeolocateControl
        showUserLocation={true}
        showAccuracyCircle={true}
        trackUserLocation={true}
      />
      <RNavigationControl position="top-right" showCompass={false} />
      {crags?.map((crag) => (
        <Fragment key={crag.id}>
          <RGradientMarker
            longitude={crag.longitude}
            latitude={crag.latitude}
            icon="climbing"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMarkerId((currentId) =>
                currentId === crag.id ? null : crag.id,
              );
            }}
          />
          {activeMarkerId === crag.id && (
            <RPopup
              longitude={crag.longitude}
              latitude={crag.latitude}
              offset={gradientMarkerPopupOffset}
              onMapMove={() => setActiveMarkerId(null)}
              onMapClick={() => setActiveMarkerId(null)}
            >
              <CragPopup crag={crag} />
            </RPopup>
          )}
        </Fragment>
      ))}
    </RMap>
  );
}
