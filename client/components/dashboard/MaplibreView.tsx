import { useEffect, useRef, useState } from "react";
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
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
          "raster-opacity": 0.7,
        },
      },
      {
        id: "street-layer",
        type: "raster",
        source: "street-tiles",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          "raster-opacity": 0.5,
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
          "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
          "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
          "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://opentopomap.org">OpenTopoMap</a>, © OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: "terrain-layer",
        type: "raster",
        source: "terrain-tiles",
        minzoom: 0,
        maxzoom: 17,
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

  // Load Maplibre GL library
  useEffect(() => {
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
    const div = document.createElement("div");
    div.style.cursor = "pointer";
    div.style.transition = "transform 0.2s";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 40 50");
    svg.setAttribute("width", "40");
    svg.setAttribute("height", "50");
    svg.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.4))";

    // Tower base
    const base = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    base.setAttribute("x", "17");
    base.setAttribute("y", "35");
    base.setAttribute("width", "6");
    base.setAttribute("height", "10");
    base.setAttribute("fill", color);
    base.setAttribute("rx", "1");
    svg.appendChild(base);

    // Tower pole
    const pole = document.createElementNS("http://www.w3.org/2000/svg", "line");
    pole.setAttribute("x1", "20");
    pole.setAttribute("y1", "10");
    pole.setAttribute("x2", "20");
    pole.setAttribute("y2", "35");
    pole.setAttribute("stroke", color);
    pole.setAttribute("stroke-width", "2.5");
    pole.setAttribute("stroke-linecap", "round");
    svg.appendChild(pole);

    // Tower top (antenna)
    const top = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    top.setAttribute("cx", "20");
    top.setAttribute("cy", "10");
    top.setAttribute("r", "3.5");
    top.setAttribute("fill", color);
    svg.appendChild(top);

    // Wi-Fi arcs (3 concentric arcs)
    const arcRadii = [7, 12, 17];
    arcRadii.forEach((radius, index) => {
      const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const arcPath = `M ${20 - radius} 10 A ${radius} ${radius} 0 0 1 ${20 + radius} 10`;
      arc.setAttribute("d", arcPath);
      arc.setAttribute("stroke", color);
      arc.setAttribute("stroke-width", "1.2");
      arc.setAttribute("fill", "none");
      arc.setAttribute("opacity", String(0.8 - index * 0.15));
      arc.setAttribute("stroke-linecap", "round");
      svg.appendChild(arc);
    });

    div.appendChild(svg);

    return div;
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

      {/* Map Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-purple-200/50 text-xs sm:text-sm z-20 max-w-xs">
        <div className="text-slate-800 font-semibold mb-2">Hybrid Satellite + Street Map</div>
        <div className="text-slate-600 text-xs space-y-1">
          <p>• Showing {sites.length} sites</p>
          <p>• Click and drag to rotate</p>
          <p>• Scroll to zoom</p>
          <p>• Click markers for details</p>
        </div>
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
