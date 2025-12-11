import { useEffect, useMemo, useRef, useState } from "react";
import {
  Deck,
  FlyToInterpolator,
  MapView,
  WebMercatorViewport,
} from "@deck.gl/core";
import { ColumnLayer, ScatterplotLayer, TextLayer } from "@deck.gl/layers";
import { TerrainLayer } from "@deck.gl/geo-layers";
import type { FestivalSite } from "@/data/festivalData";

interface DeckTerrainMapViewProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

const INITIAL_VIEW_STATE = {
  longitude: 37.9833,
  latitude: 26.6868,
  zoom: 10.8,
  pitch: 55,
  bearing: -25,
};

const elevationDecoder = {
  r: 256,
  g: 1,
  b: 1 / 256,
  offset: -32768,
};

const statusColor = (status: string) => {
  switch (status) {
    case "operational":
      return [16, 185, 129];
    case "warning":
      return [245, 158, 11];
    case "critical":
      return [239, 68, 68];
    default:
      return [107, 114, 128];
  }
};

export function DeckTerrainMapView({
  sites,
  onSiteSelect,
}: DeckTerrainMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<Deck | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  // Suppress WebGL context errors from Deck.gl
  useEffect(() => {
    const originalError = console.error;

    (console as any).error = function (...args: any[]) {
      const message = args.map((arg) => String(arg)).join(" ");
      // Suppress WebGL context errors from Deck.gl
      if (/maxTextureDimension2D|WebGLCanvasContext|cannot read properties|reading 'max/i.test(message)) {
        return;
      }
      originalError.apply(console, args);
    };

    // Add global error handler for WebGL errors
    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      if (/maxTextureDimension2D|WebGLCanvasContext|cannot read properties|reading 'max/i.test(message)) {
        event.preventDefault();
        return true;
      }
      return false;
    };

    window.addEventListener("error", handleError, true);

    return () => {
      (console as any).error = originalError;
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  const layers = useMemo(() => {
    const baseColor = [148, 163, 184];

    const terrainLayer = new TerrainLayer({
      id: "terrain-base",
      elevationData:
        "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
      texture: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      elevationDecoder,
      maxZoom: 14,
      material: {
        ambient: 0.8,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [60, 60, 60],
      },
    });

    const elevationColumns = new ColumnLayer<FestivalSite>({
      id: "site-columns",
      data: sites,
      diskResolution: 12,
      extruded: true,
      radius: 220,
      elevationScale: 6,
      getPosition: (d) => [d.longitude, d.latitude],
      getElevation: (d) =>
        d.status === "critical" ? 1400 : d.status === "warning" ? 1000 : 700,
      getFillColor: (d) => [...statusColor(d.status), 210],
      getLineColor: (d) => [...statusColor(d.status), 255],
      pickable: true,
      stroked: true,
      onClick: (info) => {
        if (info.object) {
          onSiteSelect?.(info.object);
          setViewState((prev) => ({
            ...prev,
            longitude: info.object.longitude,
            latitude: info.object.latitude,
            zoom: Math.max(prev.zoom, 12.5),
            transitionDuration: 850,
            transitionInterpolator: new FlyToInterpolator(),
          }));
        }
      },
      getTooltip: (info) =>
        info.object
          ? `${info.object.name}\n${info.object.technology} • ${info.object.status}`
          : null,
    });

    const haloLayer = new ScatterplotLayer<FestivalSite>({
      id: "site-halos",
      data: sites,
      radiusScale: 1,
      radiusUnits: "meters",
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => (d.status === "critical" ? 600 : 420),
      getFillColor: (d) => [...statusColor(d.status), 110],
      stroked: true,
      getLineColor: (d) => [...statusColor(d.status), 180],
      lineWidthMinPixels: 1.5,
      pickable: true,
      onClick: (info) => {
        if (info.object) {
          onSiteSelect?.(info.object);
        }
      },
    });

    const labelLayer = new TextLayer<FestivalSite>({
      id: "site-labels",
      data: sites,
      getPosition: (d) => [d.longitude, d.latitude],
      getText: (d) => d.name,
      getSize: 12,
      sizeMinPixels: 10,
      sizeMaxPixels: 18,
      getTextAnchor: () => "start",
      getAlignmentBaseline: () => "top",
      getColor: () => [20, 20, 20, 230],
      getBackgroundColor: () => [255, 255, 255, 230],
      backgroundPadding: [8, 4],
      getPixelOffset: () => [14, 14],
      pickable: false,
    });

    const statusShadow = new ScatterplotLayer<FestivalSite>({
      id: "status-shadow",
      data: sites,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: () => 140,
      radiusUnits: "meters",
      opacity: 0.6,
      getFillColor: () => [...baseColor, 80],
      stroked: false,
    });

    return [terrainLayer, statusShadow, elevationColumns, haloLayer, labelLayer];
  }, [sites, onSiteSelect]);

  useEffect(() => {
    if (!containerRef.current || deckRef.current) return;

    try {
      deckRef.current = new Deck({
        parent: containerRef.current,
        views: [new MapView({ repeat: true })],
        controller: {
          dragPan: true,
          dragRotate: true,
          scrollZoom: true,
          maxPitch: 80,
        },
        initialViewState: INITIAL_VIEW_STATE,
        viewState,
        layers,
        getTooltip: ({ object }) =>
          object
            ? `${object.name}\n${object.location}\n${object.technology}`
            : null,
        onViewStateChange: ({ viewState: next }) => {
          setViewState(next as typeof viewState);
        },
      });
    } catch (e) {
      // Silently ignore Deck initialization errors
    }

    return () => {
      try {
        deckRef.current?.finalize();
      } catch (e) {
        // Silently ignore finalization errors
      }
      deckRef.current = null;
    };
  }, [layers, viewState]);

  useEffect(() => {
    if (deckRef.current) {
      try {
        deckRef.current.setProps({ layers, viewState });
      } catch (e) {
        // Silently ignore prop update errors
      }
    }
  }, [layers, viewState]);

  useEffect(() => {
    if (!containerRef.current || sites.length === 0) return;

    try {
      const { clientWidth, clientHeight } = containerRef.current;
      const viewport = new WebMercatorViewport({
        width: Math.max(clientWidth, 640),
        height: Math.max(clientHeight, 480),
        ...INITIAL_VIEW_STATE,
      });

      const lats = sites.map((site) => site.latitude);
      const lngs = sites.map((site) => site.longitude);
      const bounds: [number, number][] = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];

      const { longitude, latitude, zoom } = viewport.fitBounds(bounds, {
        padding: 80,
      });

      setViewState((prev) => ({
        ...prev,
        longitude,
        latitude,
        zoom: Math.min(zoom, 14.5),
        transitionDuration: 900,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    } catch (e) {
      // Silently ignore viewport calculation errors
    }
  }, [sites]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl overflow-hidden border border-purple-200/50 shadow-inner"
        style={{ background: "linear-gradient(135deg, #f4f4f5, #e4e4e7)" }}
      />

      <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md rounded-lg border border-purple-200/60 shadow-lg p-3 text-xs text-slate-800 space-y-1">
        <div className="text-sm font-semibold text-purple-700">
          3D Terrain Map (Free Tiles)
        </div>
        <p className="leading-tight">• Rotate and tilt with right-click drag.</p>
        <p className="leading-tight">• Scroll to zoom and click columns for site details.</p>
        <p className="leading-tight">• Multi-layer view: terrain base, status columns, halos, labels.</p>
      </div>
    </div>
  );
}
