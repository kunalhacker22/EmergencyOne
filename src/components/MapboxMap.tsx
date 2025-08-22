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

  // Enhanced fallback view with visible incident map
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-card via-muted to-secondary rounded-lg border-2 border-border overflow-hidden">
      {/* Interactive incident map overlay */}
      <div className="absolute inset-0 p-4">
        <div className="relative w-full h-full bg-gradient-to-br from-muted/50 to-card/50 rounded-lg border border-border/50">
          {/* Grid pattern for map feel */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Display incidents as visible markers */}
          {incidents.map((incident, index) => {
            const color = getSeverityColor(incident.severity);
            // Create pseudo-random positions for demonstration
            const x = 20 + (index * 23) % 60;
            const y = 20 + (index * 17) % 60;
            
            return (
              <div
                key={incident.id}
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
                style={{
                  backgroundColor: color,
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                title={`${incident.type} - ${incident.location_name} (${incident.severity})`}
              />
            );
          })}
          
          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 text-xs">
            <div className="font-semibold mb-2 text-foreground">Incident Map</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Low</span>
              </div>
            </div>
          </div>
          
          {/* Mapbox upgrade notice */}
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 text-xs max-w-xs">
            <div className="font-semibold mb-1 text-foreground">Satellite View Available</div>
            <p className="text-muted-foreground">
              Configure Mapbox token for satellite imagery at{' '}
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-accent underline">
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};