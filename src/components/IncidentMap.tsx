import { MapPin, Navigation } from "lucide-react";

export const IncidentMap = () => {
  const incidents = [
    { id: 1, x: 25, y: 30, severity: "critical", type: "collision" },
    { id: 2, x: 60, y: 45, severity: "warning", type: "breakdown" },
    { id: 3, x: 40, y: 70, severity: "info", type: "debris" },
    { id: 4, x: 75, y: 25, severity: "critical", type: "collision" },
    { id: 5, x: 15, y: 80, severity: "warning", type: "weather" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-emergency-critical";
      case "warning": return "text-emergency-warning";
      case "info": return "text-emergency-info";
      default: return "text-emergency-safe";
    }
  };

  return (
    <div className="relative w-full h-96 bg-gradient-control rounded-lg border border-border overflow-hidden">
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

      {/* Control Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-current border-opacity-20" />
          ))}
        </div>
      </div>

      {/* Incident Markers */}
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: `${incident.x}%`, top: `${incident.y}%` }}
        >
          <div className={`relative ${getSeverityColor(incident.severity)}`}>
            <MapPin className="h-6 w-6 drop-shadow-lg animate-pulse" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {incident.type} - {incident.severity}
            </div>
          </div>
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="p-2 bg-card border border-border rounded hover:bg-secondary transition-colors">
          <Navigation className="h-4 w-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded p-3 space-y-2">
        <div className="text-xs font-semibold text-foreground mb-2">Severity Levels</div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-emergency-critical" />
          <span className="text-xs text-muted-foreground">Critical</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-emergency-warning" />
          <span className="text-xs text-muted-foreground">Warning</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3 text-emergency-info" />
          <span className="text-xs text-muted-foreground">Info</span>
        </div>
      </div>
    </div>
  );
};