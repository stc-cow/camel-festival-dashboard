import { useEffect, useRef, useState } from "react";
import { Layers, X } from "lucide-react";
import type { FestivalSite } from "@/data/festivalData";

interface MaplibreViewProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

type MapLayerStyle = "satellite" | "street" | "hybrid" | "terrain";

const MAP_STYLES: Record<MapLayerStyle, any> = {
  satellite: {
    version: 8,
    sources: {
      "satellite-tiles": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, Earthstar Geographics, and the GIS User Community',
      },
    },
    layers: [
      {
        id: "satellite-layer",
        type: "raster",
        source: "satellite-tiles",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          "raster-opacity": 1,
        },
      },
    ],
  },
  street: {
    version: 8,
    sources: {
      "street-tiles": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: '© CARTO, © OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: "street-layer",
        type: "raster",
        source: "street-tiles",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          "raster-opacity": 1,
        },
      },
    ],
  },
  hybrid: {
    version: 8,
    sources: {
      "satellite-tiles": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, Earthstar Geographics',
      },
      "street-tiles": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: '© CARTO, © OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: "satellite-layer",
        type: "raster",
        source: "satellite-tiles",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          "raster-opacity": 0.75,
        },
      },
      {
        id: "street-layer",
        type: "raster",
        source: "street-tiles",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          "raster-opacity": 0.4,
        },
      },
    ],
  },
  terrain: {
    version: 8,
    sources: {
      "terrain-tiles": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.esri.com/">Esri</a>, National Geographic, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp',
      },
    },
    layers: [
      {
        id: "terrain-layer",
        type: "raster",
        source: "terrain-tiles",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          "raster-opacity": 1,
        },
      },
    ],
  },
};

export function MaplibreView({
  sites,
  onSiteSelect,
}: MaplibreViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayerStyle>("hybrid");
  const [isLayerSelectorOpen, setIsLayerSelectorOpen] = useState(false);

  // Load Maplibre GL library
  useEffect(() => {
    // Suppress MapLibre AbortError from unhandled promise rejections
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes?.("AbortError") || event.reason?.name === "AbortError") {
        event.preventDefault();
      }
    };

    // Also suppress AbortError from regular error events
    const errorHandler = (event: ErrorEvent) => {
      if (event.message?.includes?.("AbortError") || event.error?.name === "AbortError") {
        event.preventDefault();
        return true;
      }
    };

    // Intercept console.error and console.warn to suppress AbortError logs
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const isAbortError = (...args: any[]): boolean => {
      return args.some((arg) => {
        if (typeof arg === "string") {
          return /abort/i.test(arg);
        }
        if (arg instanceof Error) {
          return /abort/i.test(arg.name) || /abort/i.test(arg.message);
        }
        if (arg && typeof arg === "object") {
          const str = String(arg);
          return /abort/i.test(str);
        }
        return false;
      });
    };

    (console as any).error = function(...args: any[]) {
      if (!isAbortError(...args)) {
        originalConsoleError.apply(console, args);
      }
    };

    (console as any).warn = function(...args: any[]) {
      if (!isAbortError(...args)) {
        originalConsoleWarn.apply(console, args);
      }
    };

    window.addEventListener("unhandledrejection", unhandledRejectionHandler);
    window.addEventListener("error", errorHandler);

    // Create style link for Maplibre
    const linkEl = document.createElement("link");
    linkEl.href =
      "https://cdn.jsdelivr.net/npm/maplibre-gl@4.0.0/dist/maplibre-gl.css";
    linkEl.rel = "stylesheet";
    document.head.appendChild(linkEl);

    // Create script for Maplibre
    const scriptEl = document.createElement("script");
    scriptEl.src =
      "https://cdn.jsdelivr.net/npm/maplibre-gl@4.0.0/dist/maplibre-gl.js";
    scriptEl.async = true;
    scriptEl.onload = () => {
      initializeMap();
    };
    scriptEl.onerror = () => {
      console.error("Failed to load Maplibre GL");
      setMapLoaded(true);
    };
    document.head.appendChild(scriptEl);

    return () => {
      // Restore console methods
      (console as any).error = originalConsoleError;
      (console as any).warn = originalConsoleWarn;

      // Clean up unhandled rejection handler
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
      window.removeEventListener("error", errorHandler);

      // Clean up map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          console.error("Error removing map:", e);
        }
      }

      // Clean up markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          console.error("Error removing marker:", e);
        }
      });
      markersRef.current.clear();

      if (linkEl.parentNode) document.head.removeChild(linkEl);
      if (scriptEl.parentNode) document.head.removeChild(scriptEl);
    };
  }, []);

  // Update markers when sites change
  useEffect(() => {
    if (mapInstanceRef.current && sites.length > 0) {
      updateMarkers();
    }
  }, [sites, mapLoaded]);

  const initializeMap = () => {
    if (!mapContainer.current || !window.maplibregl) return;

    // Al Ula coordinates (fallback center)
    const center = [37.9833, 26.6868] as [number, number];

    // Use the selected map style
    const map = new window.maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[currentLayer],
      center: center,
      zoom: 12,
      pitch: 30,
      bearing: 0,
      antialias: true,
      fadeDuration: 300,
    });

    map.on("load", () => {
      setMapLoaded(true);
      addMarkers();
      // Fit map bounds to show all sites
      fitMapToSites(map);
    });

    mapInstanceRef.current = map;
  };

  const switchMapLayer = (layer: MapLayerStyle) => {
    if (!mapInstanceRef.current) return;

    setCurrentLayer(layer);
    mapInstanceRef.current.setStyle(MAP_STYLES[layer]);

    // Re-add markers after style change
    setTimeout(() => {
      addMarkers();
    }, 500);
  };

  const fitMapToSites = (map: any) => {
    if (sites.length === 0) return;

    // Calculate bounds from all sites
    let minLng = sites[0].longitude;
    let maxLng = sites[0].longitude;
    let minLat = sites[0].latitude;
    let maxLat = sites[0].latitude;

    sites.forEach((site) => {
      minLng = Math.min(minLng, site.longitude);
      maxLng = Math.max(maxLng, site.longitude);
      minLat = Math.min(minLat, site.latitude);
      maxLat = Math.max(maxLat, site.latitude);
    });

    // Add padding to bounds
    const padding = 0.01;
    const bounds = [
      [minLng - padding, minLat - padding],
      [maxLng + padding, maxLat + padding],
    ] as [[number, number], [number, number]];

    // Fit map to bounds with animation
    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
    });
  };

  const addMarkers = () => {
    if (!mapInstanceRef.current || !window.maplibregl) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    sites.forEach((site) => {
      const color = getStatusColor(site.status);

      // Create custom SVG marker
      const markerElement = createMarkerSVG(site, color);

      const marker = new window.maplibregl.Marker({
        element: markerElement,
      })
        .setLngLat([site.longitude, site.latitude])
        .addTo(mapInstanceRef.current);

      // Create popup for info
      const popup = new window.maplibregl.Popup({ offset: 25 }).setHTML(
        `
        <div style="padding: 12px; font-family: Arial, sans-serif; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px; color: #1f2937;">
            ${site.name}
          </h4>
          <p style="margin: 4px 0; font-size: 12px; color: #4b5563;">
            <strong>Location:</strong> ${site.location}
          </p>
          <p style="margin: 4px 0; font-size: 12px; color: #4b5563;">
            <strong>Technology:</strong> ${site.technology}
          </p>
          <p style="margin: 4px 0; font-size: 12px; color: #4b5563;">
            <strong>Status:</strong> <span style="color: ${color}; font-weight: bold; text-transform: capitalize;">${site.status}</span>
          </p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #9ca3af;">
            Updated: ${new Date(site.lastUpdate).toLocaleTimeString()}
          </p>
        </div>
        `
      );

      marker.setPopup(popup);

      // Click handler
      markerElement.addEventListener("click", () => {
        onSiteSelect?.(site);
      });

      markersRef.current.set(site.id, marker);
    });
  };

  const updateMarkers = () => {
    if (mapInstanceRef.current && sites.length > 0) {
      addMarkers();
      // Fit to bounds whenever markers update
      setTimeout(() => fitMapToSites(mapInstanceRef.current), 100);
    }
  };

  const createMarkerSVG = (site: FestivalSite, color: string): HTMLElement => {
    const container = document.createElement("div");
    container.style.cursor = "pointer";
    container.style.transition = "transform 0.2s";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "2px";

    // Create circular marker with number
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 60 60");
    svg.setAttribute("width", "48");
    svg.setAttribute("height", "48");
    svg.style.filter = "drop-shadow(0 2px 8px rgba(0,0,0,0.3))";

    // Outer circle background
    const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outerCircle.setAttribute("cx", "30");
    outerCircle.setAttribute("cy", "30");
    outerCircle.setAttribute("r", "28");
    outerCircle.setAttribute("fill", color);
    outerCircle.setAttribute("opacity", "0.9");
    svg.appendChild(outerCircle);

    // Inner white circle border
    const borderCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    borderCircle.setAttribute("cx", "30");
    borderCircle.setAttribute("cy", "30");
    borderCircle.setAttribute("r", "25");
    borderCircle.setAttribute("fill", "white");
    svg.appendChild(borderCircle);

    // Colored inner circle
    const innerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    innerCircle.setAttribute("cx", "30");
    innerCircle.setAttribute("cy", "30");
    innerCircle.setAttribute("r", "23");
    innerCircle.setAttribute("fill", color);
    svg.appendChild(innerCircle);

    // Site ID number text
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "30");
    text.setAttribute("y", "35");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "20");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("fill", "white");
    text.textContent = site.id.replace(/\D/g, '').slice(0, 2) || "1";
    svg.appendChild(text);

    container.appendChild(svg);

    // Add site name label - not bold
    const nameLabel = document.createElement("div");
    nameLabel.textContent = site.name;
    nameLabel.style.fontSize = "11px";
    nameLabel.style.fontWeight = "normal";
    nameLabel.style.color = "#000";
    nameLabel.style.textAlign = "center";
    nameLabel.style.maxWidth = "70px";
    nameLabel.style.whiteSpace = "normal";
    nameLabel.style.pointerEvents = "none";
    nameLabel.style.lineHeight = "1.2";
    container.appendChild(nameLabel);

    return container;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "operational":
        return "#10B981"; // green
      case "warning":
        return "#F59E0B"; // amber
      case "critical":
        return "#EF4444"; // red
      default:
        return "#6B7280"; // gray
    }
  };

  return (
    <div className="w-full h-full overflow-hidden rounded-xl border border-purple-200/30 bg-gradient-to-br from-slate-100 to-slate-200 relative">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{
          backgroundColor: "#e5e7eb",
        }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <span className="text-slate-700 font-medium">Loading Hybrid Map...</span>
          </div>
        )}
      </div>

      {/* Layer Selector - Foldable Icon */}
      <div className="absolute top-28 right-4 z-20">
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
                onClick={() => switchMapLayer("satellite")}
                className={`block w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentLayer === "satellite"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => switchMapLayer("street")}
                className={`block w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentLayer === "street"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Street Map
              </button>
              <button
                onClick={() => switchMapLayer("hybrid")}
                className={`block w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  currentLayer === "hybrid"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Hybrid
              </button>
              <button
                onClick={() => switchMapLayer("terrain")}
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


      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-slate-600 z-20 pointer-events-none">
        <span className="bg-white/80 px-2 py-1 rounded border border-purple-200/50 backdrop-blur-sm inline-block">
          © OpenStreetMap & CARTO
        </span>
      </div>
    </div>
  );
}
