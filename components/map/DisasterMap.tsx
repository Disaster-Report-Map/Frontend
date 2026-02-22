"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
}

export interface DisasterMapProps {
  /** Array of latitude/longitude objects to dynamically add multiple markers */
  markers?: MapMarker[];
  /** Latitude and longitude for the center of the radar overlay coverage */
  radarCenter?: { lat: number; lng: number };
  /** Radius of the radar coverage in meters */
  radarRadiusMeters?: number;
}

/**
 * DisasterMap
 * 
 * A robust, responsive Map component built using functional React hooks and Leaflet.
 * 
 * Instructions on how to add markers and radar overlays:
 * 1. Add markers dynamically by passing an array of `MapMarker` objects to the `markers` prop.
 *    Example: <DisasterMap markers={[{ lat: 51.505, lng: -0.09, title: "Incident 1" }]} />
 * 
 * 2. Add a radar overlay (coverage area) by providing `radarCenter` (coordinates) and `radarRadiusMeters` (distance in meters).
 *    Example: <DisasterMap radarCenter={{ lat: 51.5, lng: -0.09 }} radarRadiusMeters={5000} />
 */
export default function DisasterMap({
  markers = [],
  radarCenter,
  radarRadiusMeters = 1000,
}: DisasterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // L.Map
  const markersLayerRef = useRef<any>(null); // L.LayerGroup
  const radarLayerRef = useRef<any>(null); // L.Circle

  useEffect(() => {
    let L: any;
    
    // Dynamic import to avoid Next.js "window is not defined" SSR errors with Leaflet
    import("leaflet").then((leaflet) => {
      L = leaflet.default;

      if (!mapContainerRef.current || mapInstanceRef.current) return;

      // Ensure leaflet default icons work well with modern bundlers using CDNs
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Default fallback center if geolocation gets blocked
      const defaultCenter = [51.505, -0.09] as [number, number];
      
      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        zoomControl: true, // Includes basic map controls (zoom in/out)
      }).setView(defaultCenter, 13); // Default zoom of 13

      mapInstanceRef.current = map;

      // Add default OpenStreetMap tiles (Light Mode)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Fix critical Leaflet gray tiles issue where it thinks container is 0x0 length at creation
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      // Include basic map scale control
      L.control.scale({ imperial: false, metric: true }).addTo(map);

      // Layer groups for dynamic manipulation
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Attempt to get user's location to center the map actively
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);
          },
          (error) => {
            console.warn("Geolocation blocked or failed:", error.message);
          },
          { enableHighAccuracy: true }
        );
      }
    });

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Effect to handle dynamic marker updates
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    // We fetch L from window since Leaflet sets itself on window when imported
    // Or we dynamically import again, but since it's already loaded, we can use `require("leaflet")` safely here
    import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      const markersLayer = markersLayerRef.current;

      // Clear existing markers
      markersLayer.clearLayers();

      // Add new markers from the array
      markers.forEach((markerObj) => {
        const marker = L.marker([markerObj.lat, markerObj.lng]);
        if (markerObj.title) {
          // A customized HTML template ensures the modal text color bypasses any dark-mode overriding by nextjs body css
          const popupHtml = `
            <div style="min-width: 140px; text-align: left; font-family: sans-serif;">
              <strong style="color: #1e293b; font-size: 14px; font-weight: 600; display: block; margin-bottom: 4px;">${markerObj.title}</strong>
              <small style="color: #64748b; font-size: 12px; display: block; border-top: 1px solid #e2e8f0; padding-top: 4px;">Disaster Report Match</small>
            </div>
          `;
          marker.bindPopup(popupHtml, {
            closeButton: false, // Cleaner minimalist look
            className: 'custom-dashboard-popup',
          });
        }
        markersLayer.addLayer(marker);
      });

      // Auto-zoom map to fit all markers nicely
      if (markers.length > 0) {
        const group = L.featureGroup(markersLayer.getLayers());
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    });
  }, [markers]);

  // Effect to handle radar overlay updates
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      const map = mapInstanceRef.current;

      // Remove previous radar overlay if it exists
      if (radarLayerRef.current) {
        map.removeLayer(radarLayerRef.current);
        radarLayerRef.current = null;
      }

      // Add a new radar overlay showing coverage in meters
      if (radarCenter) {
        radarLayerRef.current = L.circle([radarCenter.lat, radarCenter.lng], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.2,
          radius: radarRadiusMeters, // coverage in meters
        }).addTo(map);
      }
    });
  }, [radarCenter, radarRadiusMeters]);

  return (
    // Responsive container using Tailwind classes, perfectly filling the full screen bounds
    <div className="relative w-full h-full overflow-hidden z-0">
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
      />
    </div>
  );
}
