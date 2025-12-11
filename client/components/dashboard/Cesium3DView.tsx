import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import type { FestivalSite } from "@/data/festivalData";

interface Cesium3DViewProps {
  sites: FestivalSite[];
  onSiteSelect?: (site: FestivalSite) => void;
}

// Cesium Ion access token (using default - consider getting your own at cesium.com/ion)
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YTc0NzA1MS01ZDFjLTQwYmItODEzYi0zYjg5Y2JhODcyMDEiLCJpZCI6MTgyMDEsImFzc2V0cyI6WzExLDMyLDEwMTEwLDMwNjI2LDExODMxMzEsNDE0NjMsODMxMzYsNjk0NzEsODc5Mjg0LDM0MzkyLDIwOTQ0LDIwOTEyXSwic2NvcGVzIjpbImFzbCIsImdjIl0sImlhdCI6MTYxMTI2Mjg3Nn0.d4S6V1-nA8FwL78HG3W9xFVKGwxMhEd_q_bOEqGLqsQ";

export function Cesium3DView({ sites, onSiteSelect }: Cesium3DViewProps) {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const entitiesRef = useRef<Map<string, Cesium.Entity>>(new Map());
  const [initialized, setInitialized] = useState(false);

  // Initialize Cesium viewer
  useEffect(() => {
    if (!cesiumContainer.current || initialized) return;

    try {
      // Create viewer with OSM base map and 3D terrain
      const viewer = new Cesium.Viewer(cesiumContainer.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        timeline: false,
        animation: false,
        fullscreenButton: false,
        vrButton: false,
        navigationHelpButton: false,
        selectionIndicator: false,
        infoBox: false,
      });

      // Enable 3D mode
      viewer.scene.mode = Cesium.SceneMode.SCENE3D;

      // Set initial camera position (Al Ula, Saudi Arabia)
      const initialPosition = Cesium.Cartesian3.fromDegrees(37.9833, 26.6868, 50000);
      viewer.camera.setView({
        destination: initialPosition,
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
      });

      viewerRef.current = viewer;
      setInitialized(true);
    } catch (error) {
      console.error("Failed to initialize Cesium viewer:", error);
    }

    return () => {
      // Cleanup on unmount
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [initialized]);

  // Update markers when sites change
  useEffect(() => {
    if (!viewerRef.current || !initialized) return;

    // Clear existing markers
    entitiesRef.current.forEach((entity) => {
      viewerRef.current?.entities.remove(entity);
    });
    entitiesRef.current.clear();

    // Add site markers
    sites.forEach((site) => {
      const color = getStatusColor(site.status);
      const cesiumColor = Cesium.Color.fromCssColorString(color);

      // Create a point entity for the site
      const entity = viewerRef.current!.entities.add({
        position: Cesium.Cartesian3.fromDegrees(site.longitude, site.latitude, 1000),
        point: {
          pixelSize: 12,
          color: cesiumColor,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.NONE,
        },
        label: {
          text: site.name,
          font: "12px sans-serif",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, 20),
          showBackground: true,
          backgroundColor: new Cesium.Color(0, 0, 0, 0.5),
          backgroundPadding: new Cesium.Cartesian2(8, 4),
        },
        properties: {
          site: site,
        } as any,
      });

      // Add click handler
      if (onSiteSelect) {
        entity.site = site as any;
      }

      entitiesRef.current.set(site.id, entity);
    });

    // Fit all sites in view
    if (sites.length > 0) {
      const boundingSphere = Cesium.BoundingSphere.fromPoints(
        sites.map((s) =>
          Cesium.Cartesian3.fromDegrees(s.longitude, s.latitude, 1000)
        )
      );

      viewerRef.current.camera.flyToBoundingSphere(boundingSphere, {
        duration: 2,
      });
    }
  }, [sites, initialized, onSiteSelect]);

  // Handle marker clicks
  useEffect(() => {
    if (!viewerRef.current || !initialized || !onSiteSelect) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.scene.canvas);

    handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const pickedObject = viewerRef.current!.scene.pick(click.position);

      if (Cesium.defined(pickedObject) && pickedObject.id) {
        const site = (pickedObject.id as any).site;
        if (site) {
          onSiteSelect(site);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [initialized, onSiteSelect]);

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
      ref={cesiumContainer}
      className="w-full h-full"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "0.5rem",
        border: "2px solid rgb(168, 85, 247)",
        boxShadow: "inset 0 0 0 1px rgb(236, 72, 153)",
      }}
    >
      {!initialized && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200/50 backdrop-blur-sm z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <span className="text-slate-700 font-medium">Loading 3D Globe...</span>
        </div>
      )}
    </div>
  );
}
