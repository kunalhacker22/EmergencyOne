import { MapPin } from "lucide-react";

interface Incident {
  id: string;
  type: string;
  severity: string;
  latitude: number;
  longitude: number;
  location_name: string;
  status: string;
}

interface IncidentMapProps {
  incidents: Incident[];
}

export const IncidentMap = ({ incidents }: IncidentMapProps) => {
  // Convert lat/lng to map coordinates (simplified for demo)
  const convertToMapCoords = (lat: number, lng: number) => {
    // Simple conversion for demo - in real app this would use proper projection
    const x = ((lng + 122.5) / 0.01) % 100;
    const y = ((lat - 37.7) / 0.01) % 100;
    return { x: Math.abs(x), y: Math.abs(y) };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-emergency";
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-background to-muted rounded-lg border overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Highway lines */}
          <path d="M0,30 Q50,25 100,30" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M0,45 Q50,40 100,45" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M0,60 Q50,65 100,60" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M0,75 Q50,80 100,75" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-current border-opacity-20" />
          ))}
        </div>
      </div>

      {/* Incident markers */}
      {incidents.map((incident) => {
        const coords = convertToMapCoords(incident.latitude, incident.longitude);
        return (
          <div
            key={incident.id}
            className={`absolute w-4 h-4 -translate-x-2 -translate-y-2 cursor-pointer transition-all duration-200 hover:scale-125 z-10 group ${getSeverityColor(incident.severity)}`}
            style={{
              left: `${coords.x}%`,
              top: `${coords.y}%`,
            }}
          >
            <MapPin className="w-4 h-4" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <div className="text-xs font-medium">{incident.type}</div>
              <div className="text-xs text-muted-foreground">{incident.location_name}</div>
              <div className="text-xs text-muted-foreground capitalize">{incident.severity} - {incident.status}</div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border rounded p-3 space-y-2">
        <div className="text-xs font-semibold mb-2">Severity Levels</div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-emergency" />
          <span className="text-xs text-muted-foreground">Critical</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-destructive" />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-warning" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-success" />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
      </div>
    </div>
  );
};