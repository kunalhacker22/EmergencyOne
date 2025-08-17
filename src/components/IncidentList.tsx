import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";

export const IncidentList = () => {
  const incidents = [
    {
      id: "INC-001",
      type: "Vehicle Collision",
      location: "Highway 401 KM 245",
      time: "2 min ago",
      severity: "critical",
      responders: 3
    },
    {
      id: "INC-002", 
      type: "Vehicle Breakdown",
      location: "Highway 404 KM 180",
      time: "8 min ago",
      severity: "warning",
      responders: 1
    },
    {
      id: "INC-003",
      type: "Road Debris",
      location: "Highway 427 KM 95",
      time: "15 min ago", 
      severity: "info",
      responders: 1
    },
    {
      id: "INC-004",
      type: "Multi-Vehicle Accident",
      location: "Highway 410 KM 312",
      time: "23 min ago",
      severity: "critical",
      responders: 5
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-emergency-critical text-white";
      case "warning": return "bg-emergency-warning text-black";
      case "info": return "bg-emergency-info text-white";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical": return "CRITICAL";
      case "warning": return "WARNING";
      case "info": return "INFO";
      default: return "NORMAL";
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {incidents.map((incident) => (
        <div key={incident.id} className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className={getSeverityColor(incident.severity)}>
                  {getSeverityLabel(incident.severity)}
                </Badge>
                <span className="text-sm font-medium text-foreground">
                  {incident.id}
                </span>
              </div>
              <h4 className="font-semibold text-foreground">{incident.type}</h4>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {incident.location}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                {incident.time}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {incident.responders} responders
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" className="flex-1">
              View Details
            </Button>
            <Button size="sm" variant="default" className="flex-1">
              Dispatch Unit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};