'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface Zone {
  grid_id: string;
  grid_lat: number;
  grid_lon: number;
  violation_count: number;
  priority_score: number;
  priority_tier: string;
  police_station?: string;
  unique_vehicles?: number;
}

interface PriorityZoneMapProps {
  zones: Zone[];
}

export default function PriorityZoneMap({ zones }: PriorityZoneMapProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || !zones || zones.length === 0) return;

    // Initialize map centered on Bangalore
    const map = L.map('priority-map', {
      center: [12.9716, 77.5946],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 10,
    }).addTo(map);

    // Color mapping by priority tier
    const getMarkerColor = (tier: string) => {
      switch (tier) {
        case 'Critical': return '#ef4444'; // red-500
        case 'High': return '#f97316';     // orange-500
        case 'Medium': return '#eab308';   // yellow-500
        default: return '#22c55e';         // green-500
      }
    };

    // Create custom circular marker icon
    const createCustomIcon = (color: string, tier: string) => {
      const iconSize = tier === 'Critical' ? 16 : tier === 'High' ? 14 : 12;
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: ${iconSize}px;
          height: ${iconSize}px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          cursor: pointer;
        "></div>`,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
      });
    };

    // Add markers for each zone
    zones.forEach((zone) => {
      try {
        const color = getMarkerColor(zone.priority_tier);
        const icon = createCustomIcon(color, zone.priority_tier);

        const marker = L.marker([zone.grid_lat, zone.grid_lon], { icon });
        
        marker.bindPopup(`
          <div style="min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 6px;">
              ${zone.priority_tier} Priority Zone
            </h3>
            <div style="font-size: 13px; line-height: 1.8; color: #374151;">
              <div style="margin-bottom: 4px;">
                <strong style="color: #1f2937;">Grid ID:</strong> 
                <span style="font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${zone.grid_id}</span>
              </div>
              <div style="margin-bottom: 4px;">
                <strong style="color: #1f2937;">Violations:</strong> ${zone.violation_count.toLocaleString()}
              </div>
              <div style="margin-bottom: 4px;">
                <strong style="color: #1f2937;">Priority Score:</strong> 
                <span style="color: ${color}; font-weight: 600;">${zone.priority_score}/100</span>
              </div>
              ${zone.police_station ? `
                <div style="margin-bottom: 4px;">
                  <strong style="color: #1f2937;">Station:</strong> ${zone.police_station}
                </div>
              ` : ''}
              ${zone.unique_vehicles ? `
                <div>
                  <strong style="color: #1f2937;">Unique Vehicles:</strong> ${zone.unique_vehicles.toLocaleString()}
                </div>
              ` : ''}
            </div>
          </div>
        `, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        marker.addTo(map);
      } catch (error) {
        console.error(`Failed to add marker for zone ${zone.grid_id}:`, error);
      }
    });

    // Add legend using Control.extend (TypeScript-compatible approach)
    const LegendControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.cssText = `
          background-color: white;
          padding: 14px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          font-size: 13px;
          font-family: system-ui, -apple-system, sans-serif;
          border: 1px solid #e5e7eb;
        `;
        div.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 10px; color: #1f2937; font-size: 14px;">Priority Tiers</div>
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            <div style="width: 16px; height: 16px; background-color: #ef4444; border-radius: 50%; margin-right: 10px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
            <span style="color: #374151; font-weight: 500;">Critical</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            <div style="width: 14px; height: 14px; background-color: #f97316; border-radius: 50%; margin-right: 10px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
            <span style="color: #374151; font-weight: 500;">High</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            <div style="width: 12px; height: 12px; background-color: #eab308; border-radius: 50%; margin-right: 10px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
            <span style="color: #374151; font-weight: 500;">Medium</span>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="width: 12px; height: 12px; background-color: #22c55e; border-radius: 50%; margin-right: 10px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
            <span style="color: #374151; font-weight: 500;">Low</span>
          </div>
        `;
        return div;
      }
    });

    // Add the legend to map
    new LegendControl().addTo(map);

    // Cleanup function
    return () => {
      map.remove();
    };
  }, [zones]);

  return (
    <div 
      id="priority-map" 
      className="w-full h-96 rounded-lg shadow-md border border-gray-200" 
      role="img"
      aria-label="Interactive map showing parking violation priority zones in Bangalore"
    />
  );
}