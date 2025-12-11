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
  const isMountedRef = useRef(true);
  const pendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayerStyle>("hybrid");
  const [isLayerSelectorOpen, setIsLayerSelectorOpen] = useState(false);

  // Load Maplibre GL library
  useEffect(() => {
    isMountedRef.current = true;

    // Suppress AbortError from unhandled promise rejections
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const reason = event.reason || {};
      const reasonStr = String(reason);
      const message = reason?.message || "";
      const name = reason?.name || "";

      if (/abort/i.test(reasonStr) ||
          /abort/i.test(message) ||
          /abort/i.test(name)) {
        event.preventDefault();
      }
    };

    // Suppress AbortError from error events
    const errorEventHandler = (event: ErrorEvent) => {
      const message = event.message || "";
      const errorName = event.error?.name || "";
      const errorMsg = event.error?.message || "";

      if (/abort/i.test(message) ||
          /abort/i.test(errorName) ||
          /abort/i.test(errorMsg)) {
        event.preventDefault();
        return true;
      }
    };

    // Intercept console methods to suppress AbortError logs
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const isAbortError = (...args: any[]): boolean => {
      return args.some((arg) => {
        const str = String(arg);
        return /abort/i.test(str);
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
    window.addEventListener("error", errorEventHandler);

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
      if (isMountedRef.current) {
        initializeMap();
      }
    };
    scriptEl.onerror = () => {
      if (isMountedRef.current) {
        setMapLoaded(true);
      }
    };
    document.head.appendChild(scriptEl);

    return () => {
      isMountedRef.current = false;

      // Restore console methods
      (console as any).error = originalConsoleError;
      (console as any).warn = originalConsoleWarn;

      // Remove event listeners
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
      window.removeEventListener("error", errorEventHandler);

      // Clear any pending timeouts
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }

      // Clean up map instance carefully
      if (mapInstanceRef.current) {
        try {
          // Remove all event listeners first
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          // Silently ignore cleanup errors
        }
      }

      // Clean up markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          // Silently ignore marker cleanup errors
        }
      });
      markersRef.current.clear();

      if (linkEl.parentNode) document.head.removeChild(linkEl);
      if (scriptEl.parentNode) document.head.removeChild(scriptEl);
    };
  }, []);

  // Update markers when sites change
  useEffect(() => {
    if (isMountedRef.current && mapInstanceRef.current && sites.length > 0) {
      updateMarkers();
    }
  }, [sites, mapLoaded]);

  const initializeMap = () => {
    if (!mapContainer.current || !window.maplibregl || !isMountedRef.current) return;

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
      crossSourceCollisions: false,
    });

    // Suppress internal error events from the map - especially AbortErrors
    map.on("error", (event: any) => {
      const errorStr = String(event?.error || "");
      const errorMsg = event?.error?.message || "";
      const errorName = event?.error?.name || "";

      if (/abort/i.test(errorStr) ||
          /abort/i.test(errorMsg) ||
          /abort/i.test(errorName) ||
          errorName === "AbortError") {
        return;
      }
    });

    const handleMapLoad = () => {
      if (!isMountedRef.current) return;
      if (isMountedRef.current) {
        setMapLoaded(true);
      }
      if (isMountedRef.current && mapInstanceRef.current) {
        addMarkers();
        fitMapToSites(mapInstanceRef.current);
      }
    };

    map.on("load", handleMapLoad);

    mapInstanceRef.current = map;
  };

  const switchMapLayer = (layer: MapLayerStyle) => {
    if (!mapInstanceRef.current || !isMountedRef.current) return;

    setCurrentLayer(layer);

    // Clear any pending timeout from previous style changes
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }

    // Wrap setStyle in a safe operation that checks if component is still mounted
    try {
      mapInstanceRef.current.setStyle(MAP_STYLES[layer]);
    } catch (e) {
      // Silently ignore style change errors
      return;
    }

    // Re-add markers after style change with proper mount check
    pendingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && mapInstanceRef.current) {
        addMarkers();
      }
    }, 800);
  };

  const fitMapToSites = (map: any) => {
    if (!isMountedRef.current || !map || sites.length === 0) return;

    try {
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
      if (isMountedRef.current && map) {
        map.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
      }
    } catch (e) {
      // Silently ignore fitBounds errors
    }
  };

  const addMarkers = () => {
    if (!isMountedRef.current || !mapInstanceRef.current || !window.maplibregl) return;

    try {
      // Clear existing markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          // Silently ignore marker removal errors
        }
      });
      markersRef.current.clear();

      // Only add markers if map is still available
      if (!mapInstanceRef.current) return;

      sites.forEach((site) => {
        if (!isMountedRef.current || !mapInstanceRef.current) return;

        const color = getStatusColor(site.status);

        // Create custom SVG marker
        const markerElement = createMarkerSVG(site, color);

        try {
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
        } catch (e) {
          // Silently ignore marker creation errors
        }
      });
    } catch (e) {
      // Silently ignore marker operations errors
    }
  };

  const updateMarkers = () => {
    if (!isMountedRef.current || !mapInstanceRef.current || sites.length === 0) return;

    try {
      addMarkers();
      // Fit to bounds whenever markers update
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
      pendingTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && mapInstanceRef.current) {
          fitMapToSites(mapInstanceRef.current);
        }
      }, 100);
    } catch (e) {
      // Silently ignore update errors
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

    // Create image marker with telecom tower icon - MINIMIZED
    const iconContainer = document.createElement("div");
    iconContainer.style.position = "relative";
    iconContainer.style.width = "32px";
    iconContainer.style.height = "32px";
    iconContainer.style.filter = "drop-shadow(0 1px 4px rgba(0,0,0,0.3))";

    const img = document.createElement("img");
    img.src = "https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F337d21741ce545d5b5567c095ddcf011?format=webp&width=800";
    img.alt = site.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.pointerEvents = "none";
    img.style.userSelect = "none";

    iconContainer.appendChild(img);
    container.appendChild(iconContainer);

    // Add site name label - not bold, smaller
    const nameLabel = document.createElement("div");
    nameLabel.textContent = site.name;
    nameLabel.style.fontSize = "8px";
    nameLabel.style.fontWeight = "normal";
    nameLabel.style.color = "#000";
    nameLabel.style.textAlign = "center";
    nameLabel.style.maxWidth = "60px";
    nameLabel.style.whiteSpace = "normal";
    nameLabel.style.pointerEvents = "none";
    nameLabel.style.lineHeight = "1.1";
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
    <div
      className="w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 relative"
      style={{
        border: "3px solid rgb(168, 85, 247)",
        boxShadow: "inset 0 0 0 2px rgb(236, 72, 153), 0 0 0 1px rgb(168, 85, 247)"
      }}
    >
      <style>{`
        .maplibregl-attribution {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
        }
        .maplibregl-ctrl-bottom-right {
          bottom: -30px !important;
        }
      `}</style>
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{
          backgroundColor: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <span className="text-slate-700 font-medium">Loading Hybrid Map...</span>
          </div>
        )}
      </div>

      {/* Flag Icon - Above Layer Selector */}
      <div className="absolute top-4 left-4 z-20">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F816100c27387414c8114242260ac3118?format=webp&width=800"
          alt="Festival Camel Riders"
          className="w-32 h-32 object-contain drop-shadow-md"
        />
      </div>

      {/* Layer Selector - Foldable Icon */}
      <div className="absolute bottom-4 left-4 z-20">
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


    </div>
  );
}
