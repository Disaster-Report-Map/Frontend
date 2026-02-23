"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  category?: string; // e.g. 'fire', 'flood'
  status?: string;   // e.g. 'active', 'resolved'
}

export interface DisasterMapProps {
  /** Array of latitude/longitude objects to dynamically add multiple markers */
  markers?: MapMarker[];
  /** Latitude and longitude for the center of the radar overlay coverage */
  radarCenter?: { lat: number; lng: number };
  /** Radius of the radar coverage in meters */
  radarRadiusMeters?: number;
  /** Pass a coordinate to actively pan the map (used for Search & Re-center) */
  forcedCenter?: { lat: number; lng: number } | null;
  /** Callback fired when user clicks anywhere on the map */
  onMapClick?: (lat: number, lng: number) => void;
  /** Coordinate to display a pulsing radar for a draft report */
  draftReportLocation?: { lat: number; lng: number } | null;
  /** Explicitly rendering the user's active GPS coordinate distinct from incidents */
  userLocation?: { lat: number; lng: number } | null;
  /** Array of dynamically submitted radar zones */
  dynamicRadars?: { lat: number; lng: number }[];
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
  forcedCenter = null,
  onMapClick,
  draftReportLocation = null,
  userLocation = null,
}: DisasterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // L.Map
  const markersLayerRef = useRef<any>(null); // L.LayerGroup
  const radarLayerRef = useRef<any>(null); // L.Circle
  const draftLayerRef = useRef<any>(null); // L.CircleMarker
  const userMarkerRef = useRef<any>(null); // L.Marker
  const dynamicRadarsLayerRef = useRef<any>(null); // L.LayerGroup

  // Keep a fresh reference to the click callback without re-binding Leaflet events
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

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

      // Listen for click-to-report
      map.on('click', (e: any) => {
        if (onMapClickRef.current) {
          onMapClickRef.current(e.latlng.lat, e.latlng.lng);
        }
      });

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

  // Effect to handle dynamic marker updates & Marker Clustering
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    Promise.all([
      import("leaflet"),
      import("leaflet.markercluster"),
    ]).then(([leaflet]) => {
      const L = leaflet.default;
      const map = mapInstanceRef.current;

      // Clean up previously built clusters to prevent memory leaks during React hot-reloading or data updates
      if (markersLayerRef.current) {
        map.removeLayer(markersLayerRef.current);
      }

      // Initialize the advanced marker clusterer
      // @ts-ignore - plugin injects to L object
      const markersLayer = L.markerClusterGroup({
        chunkedLoading: true, // Smooths out performance when processing 100+ points
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          let c = 'bg-blue-600/90 shadow-blue-500/50';
          if (count >= 10) c = 'bg-rose-600/90 shadow-rose-500/50';
          
          return L.divIcon({ 
            html: `<div class="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold shadow-lg ${c}">${count}</div>`,
            className: 'custom-cluster-icon bg-transparent border-0', 
            iconSize: L.point(40, 40) 
          });
        }
      });

      // Add new markers from the array
      markers.forEach((markerObj) => {
        const marker = L.marker([markerObj.lat, markerObj.lng]);
        if (markerObj.title) {
          // A customized HTML template ensures the modal text color bypasses any dark-mode overriding by nextjs body css
          let badgeColor = '#3b82f6'; // blue base
          if (markerObj.category === 'fire') badgeColor = '#ef4444';
          if (markerObj.category === 'flood') badgeColor = '#0ea5e9';
          if (markerObj.category === 'medical') badgeColor = '#10b981';

          const popupHtml = `
            <div style="min-width: 180px; text-align: left; font-family: sans-serif; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                 <span style="background: ${badgeColor}20; color: ${badgeColor}; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: bold; text-transform: uppercase;">
                   ${markerObj.category || 'Incident'}
                 </span>
                 <span style="font-size: 10px; color: ${markerObj.status === 'resolved' ? '#10b981' : '#f59e0b'}; font-weight: bold;">
                    ● ${markerObj.status || 'Active'}
                 </span>
              </div>
              <strong style="color: #1e293b; font-size: 14px; font-weight: 700; display: block; margin-bottom: 6px; line-height: 1.2;">
                ${markerObj.title}
              </strong>
              <button style="width: 100%; border: none; background: #f8fafc; color: #334155; font-size: 11px; font-weight: 600; padding: 6px; border-radius: 4px; cursor: pointer; border: 1px solid #e2e8f0;">
                View Details
              </button>
            </div>
          `;
          marker.bindPopup(popupHtml, {
            closeButton: false, // Cleaner minimalist look
            className: 'custom-dashboard-popup',
            minWidth: 200,
          });
        }
        markersLayer.addLayer(marker);
      });

      // Save reference and map it
      markersLayerRef.current = markersLayer;
      map.addLayer(markersLayer);

      // Auto-zoom map to fit all markers nicely if we have raw markers and no user-forced zoom state
      if (markers.length > 0) {
        map.fitBounds(markersLayer.getBounds(), { padding: [50, 50], maxZoom: 15 });
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

  // Effect to handle dynamic radars array
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      const map = mapInstanceRef.current;
      
      if (dynamicRadarsLayerRef.current) {
        map.removeLayer(dynamicRadarsLayerRef.current);
      }
      
      if (!dynamicRadars || dynamicRadars.length === 0) return;
      
      const layerGroup = L.layerGroup();
      dynamicRadars.forEach(radar => {
        L.circle([radar.lat, radar.lng], {
          color: '#10b981', // emerald-500
          fillColor: '#10b981',
          fillOpacity: 0.15,
          weight: 1,
          radius: 2000, // 2km radius
          className: 'animate-pulse' // native tailwind support in Leaflet
        }).addTo(layerGroup);
      });
      
      dynamicRadarsLayerRef.current = layerGroup;
      map.addLayer(layerGroup);
    });
  }, [dynamicRadars]);

  // Effect to handle Draft Report pulsing radar
  useEffect(() => {
    if (!mapInstanceRef.current || !draftReportLocation) {
      if (draftLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(draftLayerRef.current);
        draftLayerRef.current = null;
      }
      return;
    }

    import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      const map = mapInstanceRef.current;

      if (draftLayerRef.current) map.removeLayer(draftLayerRef.current);

      draftLayerRef.current = L.circleMarker([draftReportLocation.lat, draftReportLocation.lng], {
        radius: 8,
        color: '#f43f5e', // rose-500
        fillColor: '#f43f5e',
        fillOpacity: 0.8,
        weight: 2,
        className: 'animate-ping' // Tailwind animation class native integration!
      }).addTo(map);

      // Also add a hard center dot
      L.circleMarker([draftReportLocation.lat, draftReportLocation.lng], {
        radius: 4,
        color: '#fff',
        fillColor: '#be123c', // rose-700
        fillOpacity: 1,
        weight: 1,
      }).addTo(map);
    });
  }, [draftReportLocation]);

  // Effect to handle Live User Location beacon
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) {
      if (userMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      return;
    }

    import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      const map = mapInstanceRef.current;

      if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);

      const userIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"><div class="w-full h-full bg-blue-400 rounded-full animate-ping opacity-75"></div></div>`,
        className: 'bg-transparent border-0',
        iconSize: L.point(16, 16),
        iconAnchor: L.point(8, 8)
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      
      const popupHtml = `
        <div style="min-width: 120px; text-align: left; font-family: sans-serif; padding: 2px;">
          <strong style="color: #1e293b; font-size: 14px; font-weight: 700;">📍 Your Location</strong>
        </div>
      `;
      userMarkerRef.current.bindPopup(popupHtml, { className: 'custom-dashboard-popup', closeButton: false });
    });
  }, [userLocation]);

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
