import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Incident {
  id: string;
  type: string;
  severity: string;
  latitude: number;
  longitude: number;
  location_name: string;
  status: string;
}

interface MapboxMapProps {
  incidents: Incident[];
}

export const MapboxMap = ({ incidents }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // TODO: User needs to add their Mapbox token
    // For now, we'll show instructions to the user
    const mapboxToken = 'your-mapbox-token-here';
    
    if (mapboxToken === 'your-mapbox-token-here') {
      // Show fallback map with instructions
      return;
    }

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup function
    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for incidents
    incidents.forEach((incident) => {
      const color = getSeverityColor(incident.severity);
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.backgroundColor = color;
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <div class="font-semibold">${incident.type}</div>
          <div class="text-sm text-gray-600">${incident.location_name}</div>
          <div class="text-sm">
            <span class="capitalize">${incident.severity}</span> - 
            <span class="capitalize">${incident.status}</span>
          </div>
        </div>
      `);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([incident.longitude, incident.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [incidents]);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical": return "#ef4444";
      case "high": return "#f97316";
      case "medium": return "#eab308";
      case "low": return "#22c55e";
      default: return "#6b7280";
    }
  };

  // Fallback view when Mapbox token is not configured
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-background to-muted rounded-lg border overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 bg-card border rounded-lg max-w-md">
          <h3 className="text-lg font-semibold mb-2">Satellite Map Configuration Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To enable satellite view, please configure your Mapbox access token.
          </p>
          <div className="text-xs text-muted-foreground space-y-2">
            <p>1. Go to <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-emergency underline">mapbox.com</a></p>
            <p>2. Create an account and get your public token</p>
            <p>3. Contact support to configure the token</p>
          </div>
        </div>
      </div>
      
      {/* Fallback basic map */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,30 Q50,25 100,30" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M0,45 Q50,40 100,45" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M0,60 Q50,65 100,60" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M0,75 Q50,80 100,75" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
    </div>
  );
};