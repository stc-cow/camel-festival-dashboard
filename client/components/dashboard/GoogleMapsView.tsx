import { useEffect, useRef, useState } from "react";
import type { FestivalSite } from "@/data/festivalData";

interface GoogleMapsViewProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

export function GoogleMapsView({
  sites,
  onSiteSelect,
}: GoogleMapsViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // Get API key from environment or use placeholder
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDDJzMCdTTcG8mn1ZEsWQJPHKL-G77tZWY";

    // Load Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps API");
      setMapLoaded(true); // Still set as loaded to show fallback
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map after Google Maps is loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [mapLoaded]);

  // Update markers when sites change
  useEffect(() => {
    if (mapInstanceRef.current && sites.length > 0) {
      updateMarkers();
    }
  }, [sites, mapLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    // Al Ula coordinates
    const center = { lat: 26.6868, lng: 37.9833 };

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: center,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
      tilt: 45,
      heading: 45,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstanceRef.current = map;
    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();

    // Add markers for each site
    sites.forEach((site) => {
      const position = {
        lat: site.latitude,
        lng: site.longitude,
      };

      // Create custom marker with GSM tower and Wi-Fi arcs
      const markerElement = createCustomMarkerElement(site);

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: position,
        map: mapInstanceRef.current,
        content: markerElement,
        title: site.name,
      });

      // Add click listener
      marker.addListener("click", () => {
        onSiteSelect?.(site);
        showInfoWindow(site, position);
      });

      markersRef.current.set(site.id, marker);
    });
  };

  const createCustomMarkerElement = (site: FestivalSite): HTMLElement => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.width = "50px";
    div.style.height = "50px";
    div.style.cursor = "pointer";
    div.style.transition = "transform 0.2s";

    // Get status color
    const statusColor = getStatusColor(site.status);
    const towerColor = getStatusColor(site.status);

    // Create SVG with GSM tower and Wi-Fi arcs
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 40 50");
    svg.setAttribute("width", "40");
    svg.setAttribute("height", "50");
    svg.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

    // Tower base
    const base = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    base.setAttribute("x", "17");
    base.setAttribute("y", "35");
    base.setAttribute("width", "6");
    base.setAttribute("height", "10");
    base.setAttribute("fill", towerColor);
    svg.appendChild(base);

    // Tower pole
    const pole = document.createElementNS("http://www.w3.org/2000/svg", "line");
    pole.setAttribute("x1", "20");
    pole.setAttribute("y1", "10");
    pole.setAttribute("x2", "20");
    pole.setAttribute("y2", "35");
    pole.setAttribute("stroke", towerColor);
    pole.setAttribute("stroke-width", "2");
    svg.appendChild(pole);

    // Tower top
    const top = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    top.setAttribute("cx", "20");
    top.setAttribute("cy", "10");
    top.setAttribute("r", "3");
    top.setAttribute("fill", towerColor);
    svg.appendChild(top);

    // Wi-Fi arcs (3 of them)
    const arcRadii = [8, 13, 18];
    arcRadii.forEach((radius, index) => {
      const arc = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const arcPath = `M ${20 - radius} 10 A ${radius} ${radius} 0 0 1 ${20 + radius} 10`;
      arc.setAttribute("d", arcPath);
      arc.setAttribute("stroke", statusColor);
      arc.setAttribute("stroke-width", "1.5");
      arc.setAttribute("fill", "none");
      arc.setAttribute("opacity", `${1 - index * 0.2}`);
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

  const showInfoWindow = (site: FestivalSite, position: any) => {
    // Create info window content
    const content = `
      <div style="padding: 8px; font-family: Arial, sans-serif;">
        <h4 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${site.name}</h4>
        <p style="margin: 2px 0; font-size: 12px; color: #666;">
          <strong>Technology:</strong> ${site.technology}
        </p>
        <p style="margin: 2px 0; font-size: 12px; color: #666;">
          <strong>Status:</strong> <span style="color: ${getStatusColor(site.status)}; font-weight: bold; text-transform: capitalize;">${site.status}</span>
        </p>
        <p style="margin: 2px 0; font-size: 12px; color: #666;">
          <strong>Power:</strong> ${site.powerStatus}
        </p>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">
          Updated: ${new Date(site.lastUpdate).toLocaleTimeString()}
        </p>
      </div>
    `;

    // Create and show info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: content,
      position: position,
    });

    infoWindow.open(mapInstanceRef.current);

    // Close other info windows (optional)
    setTimeout(() => {
      infoWindow.close();
    }, 5000);
  };

  return (
    <div className="w-full h-full overflow-hidden rounded-xl border border-purple-200/30 bg-white/10">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{
          backgroundColor: "rgba(200, 200, 200, 0.5)",
        }}
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-600">Loading map...</span>
          </div>
        )}
      </div>
    </div>
  );
}
