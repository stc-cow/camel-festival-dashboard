import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Layers, X } from "lucide-react";
import type { FestivalSite } from "@/data/festivalData";

// Import Leaflet CSS
if (typeof window !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
  document.head.appendChild(link);
}

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LeafletMapViewProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

type MapLayerStyle = "satellite" | "street" | "hybrid" | "terrain";

const MAP_STYLES: Record<
  MapLayerStyle,
  { url: string; attribution: string }
> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      '© <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, Earthstar Geographics',
  },
  street: {
    url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    attribution: "© CARTO, © OpenStreetMap contributors",
  },
  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      '© <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, Earthstar Geographics',
  },
  terrain: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      '© <a href="https://www.esri.com/">Esri</a>, National Geographic, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA',
  },
};

function MapController({
  sites,
  currentLayer,
}: {
  sites: FestivalSite[];
  currentLayer: MapLayerStyle;
}) {
  const map = useMap();

  useEffect(() => {
    if (sites.length === 0) return;

    const lats = sites.map((site) => site.latitude);
    const lngs = sites.map((site) => site.longitude);

    const bounds = L.latLngBounds(
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [sites, map]);

  return null;
}

function MarkerLayer({
  sites,
  onSiteSelect,
}: {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}) {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "operational":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "critical":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const createCustomIcon = (site: FestivalSite) => {
    const color = getStatusColor(site.status);
    const html = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        cursor: pointer;
      ">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F2e346d5e56684e7d8c96ab8186c6b8ba?format=webp&width=800"
          alt="tower"
          style="
            width: 40px;
            height: 50px;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)) brightness(0) saturate(100%) invert(${site.status === 'operational' ? '40' : site.status === 'warning' ? '50' : '30'}%);
            flex-shrink: 0;
          "
        />
        <div style="
          font-size: 10px;
          font-weight: bold;
          color: #1f2937;
          white-space: nowrap;
          max-width: 80px;
          text-overflow: ellipsis;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        ">
          ${site.name}
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      iconSize: [80, 70],
      iconAnchor: [40, 70],
      popupAnchor: [0, -70],
      className: "custom-icon",
    });
  };

  return (
    <>
      {sites
        .filter(
          (site) =>
            site.latitude !== undefined &&
            site.latitude !== null &&
            site.longitude !== undefined &&
            site.longitude !== null &&
            !isNaN(site.latitude) &&
            !isNaN(site.longitude)
        )
        .map((site) => (
          <Marker
            key={site.id}
            position={[site.latitude, site.longitude]}
            icon={createCustomIcon(site)}
            eventHandlers={{
              click: () => {
                onSiteSelect?.(site);
              },
            }}
          >
            <Popup offset={[0, -10]} maxWidth={250}>
              <div style={{ padding: "8px" }}>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#1f2937",
                  }}
                >
                  {site.name}
                </h4>
                <p style={{ margin: "4px 0", fontSize: "12px", color: "#4b5563" }}>
                  <strong>Location:</strong> {site.location}
                </p>
                <p style={{ margin: "4px 0", fontSize: "12px", color: "#4b5563" }}>
                  <strong>Technology:</strong> {site.technology}
                </p>
                <p style={{ margin: "4px 0", fontSize: "12px", color: "#4b5563" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: getStatusColor(site.status),
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {site.status}
                  </span>
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "11px",
                    color: "#9ca3af",
                  }}
                >
                  Updated: {new Date(site.lastUpdate).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
}

export function LeafletMapView({
  sites,
  onSiteSelect,
}: LeafletMapViewProps) {
  const [currentLayer, setCurrentLayer] = useState<MapLayerStyle>("hybrid");
  const [isLayerSelectorOpen, setIsLayerSelectorOpen] = useState(false);
  const tileStyle = MAP_STYLES[currentLayer];

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200"
      style={{
        border: "2px solid rgb(168, 85, 247)",
        boxShadow: "inset 0 0 0 1px rgb(236, 72, 153)",
      }}
    >
      <MapContainer
        center={[26.6868, 37.9833]}
        zoom={12}
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer url={tileStyle.url} attribution={tileStyle.attribution} />
        <MarkerLayer sites={sites} onSiteSelect={onSiteSelect} />
        <MapController sites={sites} currentLayer={currentLayer} />
      </MapContainer>

      {/* Flag Icon - Above Layer Selector */}
      <div
        className="absolute top-2 left-2 pointer-events-auto"
        style={{
          zIndex: 10000,
        }}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F816100c27387414c8114242260ac3118?format=webp&width=800"
          alt="Festival Camel Riders"
          className="w-64 h-64 object-contain drop-shadow-md"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
      </div>

      {/* Layer Selector - Foldable Icon */}
      <div
        className="absolute bottom-2 left-2 pointer-events-auto"
        style={{ zIndex: 10000 }}
      >
        {!isLayerSelectorOpen ? (
          <button
            onClick={() => setIsLayerSelectorOpen(true)}
            className="bg-white/90 backdrop-blur-md rounded-lg p-2 border border-purple-200/50 hover:bg-white transition-all shadow-md"
            title="Toggle Map Layers"
          >
            <Layers className="w-5 h-5 text-slate-700" />
          </button>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-lg border border-purple-200/50 shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-purple-200/30">
              <div className="text-slate-800 font-bold text-xs">Map Layers</div>
              <button
                onClick={() => setIsLayerSelectorOpen(false)}
                className="text-slate-600 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 p-2">
              <button
                onClick={() => {
                  setCurrentLayer("satellite");
                  setIsLayerSelectorOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentLayer === "satellite"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => {
                  setCurrentLayer("street");
                  setIsLayerSelectorOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentLayer === "street"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Street Map
              </button>
              <button
                onClick={() => {
                  setCurrentLayer("hybrid");
                  setIsLayerSelectorOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentLayer === "hybrid"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Hybrid
              </button>
              <button
                onClick={() => {
                  setCurrentLayer("terrain");
                  setIsLayerSelectorOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentLayer === "terrain"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Terrain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
