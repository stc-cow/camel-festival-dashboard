import { useEffect, useRef, useState } from "react";
import { Layers, X } from "lucide-react";
import type { FestivalSite } from "@/data/festivalData";

interface DeckglViewProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

export function DeckglView({ sites, onSiteSelect }: DeckglViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLayerSelectorOpen, setIsLayerSelectorOpen] = useState(false);

  useEffect(() => {
    // Suppress AbortError logs
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const isAbortError = (...args: any[]): boolean => {
      return args.some((arg) => {
        const str = String(arg);
        return /abort/i.test(str);
      });
    };

    (console as any).error = function (...args: any[]) {
      if (!isAbortError(...args)) {
        originalConsoleError.apply(console, args);
      }
    };

    (console as any).warn = function (...args: any[]) {
      if (!isAbortError(...args)) {
        originalConsoleWarn.apply(console, args);
      }
    };

    const initDeckGL = async () => {
      try {
        const { Deck } = await import("@deck.gl/core");
        const { GeoJsonLayer, IconLayer, ScatterplotLayer } = await import(
          "@deck.gl/layers"
        );
        const { TileLayer } = await import("@deck.gl/geo-layers");

        if (!containerRef.current) return;

        const getStatusColor = (status: string): [number, number, number] => {
          switch (status) {
            case "operational":
              return [16, 185, 129]; // green
            case "warning":
              return [245, 158, 11]; // amber
            case "critical":
              return [239, 68, 68]; // red
            default:
              return [107, 114, 128]; // gray
          }
        };

        // Create scatter plot layer for tower icons
        const scatterLayer = new ScatterplotLayer({
          id: "scatter-plot",
          data: sites,
          pickable: true,
          opacity: 0.8,
          radiusScale: 50,
          radiusMinPixels: 35,
          radiusMaxPixels: 100,
          lineWidthMinPixels: 2,
          getPosition: (d: FestivalSite) => [d.longitude, d.latitude],
          getFillColor: (d: FestivalSite) => getStatusColor(d.status),
          getLineColor: () => [255, 255, 255],
          getLineWidth: () => 2,
          onHover: (info: any) => {
            if (containerRef.current) {
              containerRef.current.style.cursor = info.object
                ? "pointer"
                : "grab";
            }
          },
          onClick: (info: any) => {
            if (info.object) {
              onSiteSelect?.(info.object);
            }
          },
        });

        // Base map layer using tiles
        const tileLayer = new TileLayer({
          data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
          minZoom: 0,
          maxZoom: 19,
          tileSize: 256,
          renderSubLayers: (props: any) => {
            const {
              bbox: [west, south, east, north],
            } = props.tile;

            return new GeoJsonLayer({
              ...props,
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: [
                        [
                          [west, south],
                          [east, south],
                          [east, north],
                          [west, north],
                          [west, south],
                        ],
                      ],
                    },
                  },
                ],
              },
              stroked: false,
              filled: false,
              pickable: false,
              autoHighlight: false,
            });
          },
        });

        const initialViewState = {
          longitude: 37.9833,
          latitude: 26.6868,
          zoom: 12,
          pitch: 45,
          bearing: 0,
        };

        const deck = new Deck({
          container: containerRef.current,
          initialViewState,
          controller: true,
          layers: [tileLayer, scatterLayer],
          onWebGLInitialized: () => setMapLoaded(true),
        });

        deckRef.current = deck;

        // Fit bounds to all sites
        if (sites.length > 0) {
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

          const centerLng = (minLng + maxLng) / 2;
          const centerLat = (minLat + maxLat) / 2;
          const deltaLng = maxLng - minLng;
          const deltaLat = maxLat - minLat;
          const zoom = Math.min(
            12,
            Math.floor(
              Math.log2(
                Math.max(
                  360 / deltaLng,
                  Math.max(
                    85.051129 /
                      Math.log(
                        Math.tan(
                          Math.PI / 4 +
                            ((maxLat * Math.PI) / 180 / 2)
                        )
                      ) -
                      Math.log(
                        Math.tan(
                          Math.PI / 4 +
                            ((minLat * Math.PI) / 180 / 2)
                        )
                      ),
                    -1
                  ) / 256
                )
              )
            )
          );

          deck.setProps({
            initialViewState: {
              longitude: centerLng,
              latitude: centerLat,
              zoom,
              pitch: 45,
              bearing: 0,
              transitionDuration: 1000,
            },
          });
        }
      } catch (error) {
        console.error("Error loading Deck.gl:", error);
        setMapLoaded(true);
      }
    };

    initDeckGL();

    return () => {
      (console as any).error = originalConsoleError;
      (console as any).warn = originalConsoleWarn;

      if (deckRef.current) {
        try {
          deckRef.current.finalize();
        } catch (e) {
          // Silently ignore cleanup errors
        }
      }
    };
  }, [sites, onSiteSelect]);

  return (
    <div className="w-full h-full overflow-hidden rounded-xl relative bg-gradient-to-br from-slate-100 to-slate-200">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ backgroundColor: "#e5e7eb" }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" />
            <span className="text-slate-700 font-medium">
              Loading 3D Map...
            </span>
          </div>
        )}
      </div>

      {/* Layer Selector - Foldable Icon */}
      <div className="absolute top-28 right-4 z-20">
        {!isLayerSelectorOpen ? (
          <button
            onClick={() => setIsLayerSelectorOpen(true)}
            className="bg-white/90 backdrop-blur-md rounded-lg p-2 border border-purple-200/50 hover:bg-white transition-all shadow-md"
            title="Map Controls"
          >
            <Layers className="w-5 h-5 text-slate-700" />
          </button>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-lg border border-purple-200/50 shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-purple-200/30">
              <div className="text-slate-800 font-bold text-xs">
                Map Controls
              </div>
              <button
                onClick={() => setIsLayerSelectorOpen(false)}
                className="text-slate-600 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 p-2 text-xs">
              <p className="text-slate-700">
                <strong>Rotate:</strong> Click + Drag
              </p>
              <p className="text-slate-700">
                <strong>Zoom:</strong> Scroll
              </p>
              <p className="text-slate-700">
                <strong>Pan:</strong> Right Click + Drag
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-slate-600 z-20 pointer-events-none">
        <span className="bg-white/80 px-2 py-1 rounded border border-purple-200/50 backdrop-blur-sm inline-block">
          © OpenStreetMap contributors
        </span>
      </div>
    </div>
  );
}
