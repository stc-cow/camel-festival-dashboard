import { useEffect, useRef, useState } from "react";
import type { FestivalSite } from "@/data/festivalData";

interface MapboxViewProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

export function MapboxView({
  sites,
  onSiteSelect,
}: MapboxViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Mapbox GL library
  useEffect(() => {
    // Create script elements for Mapbox GL
    const linkEl = document.createElement("link");
    linkEl.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css";
    linkEl.rel = "stylesheet";
    document.head.appendChild(linkEl);

    const scriptEl = document.createElement("script");
    scriptEl.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js";
    scriptEl.async = true;
    scriptEl.onload = () => {
      initializeMap();
    };
    scriptEl.onerror = () => {
      console.error("Failed to load Mapbox GL");
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
    if (!mapContainer.current || !window.mapboxgl) return;

    // Set Mapbox access token (using public token - no key required)
    window.mapboxgl.accessToken =
      "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycW1waHBicml5MGsifQ.rJcFIG214AriISLbB6B6nA";

    // Al Ula coordinates
    const center = [37.9833, 26.6868] as [number, number];

    const map = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: center,
      zoom: 15,
      pitch: 45,
      bearing: 45,
      antialias: true,
    });

    // Add terrain
    map.on("load", () => {
      // Add terrain layer for 3D effect
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxZoom: 14,
      });

      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Add sky layer
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun-intensity": 0.3,
        },
      });

      setMapLoaded(true);
      updateMarkers();

      // Add markers
      addMarkers();
    });

    mapInstanceRef.current = map;
  };

  const addMarkers = () => {
    if (!mapInstanceRef.current || !window.mapboxgl) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    sites.forEach((site) => {
      const color = getStatusColor(site.status);

      // Create custom SVG marker
      const markerElement = createMarkerSVG(site, color);

      const marker = new window.mapboxgl.Marker({
        element: markerElement,
      })
        .setLngLat([site.longitude, site.latitude])
        .addTo(mapInstanceRef.current);

      // Create popup for info
      const popup = new window.mapboxgl.Popup({ offset: 25 }).setHTML(
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
            <span className="text-slate-700 font-medium">Loading 3D Satellite Map...</span>
          </div>
        )}
      </div>

      {/* Map Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-purple-200/50 text-xs sm:text-sm z-20 max-w-xs">
        <div className="text-slate-800 font-semibold mb-2">3D Satellite View</div>
        <div className="text-slate-600 text-xs space-y-1">
          <p>• Click and drag to rotate</p>
          <p>• Right-click and drag to tilt</p>
          <p>• Scroll to zoom</p>
          <p>• Click markers for site details</p>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-slate-600 z-20 pointer-events-none">
        <span className="bg-white/80 px-2 py-1 rounded border border-purple-200/50 backdrop-blur-sm inline-block">
          Powered by Mapbox
        </span>
      </div>
    </div>
  );
}
