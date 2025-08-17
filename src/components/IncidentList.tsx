import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, Users, AlertTriangle } from "lucide-react";

interface Incident {
  id: string;
  type: string;
  location_name: string;
  created_at: string;
  severity: string;
  responders_assigned: number;
  status: string;
  description?: string;
}

interface IncidentListProps {
  incidents: Incident[];
  onUpdateStatus?: (incidentId: string, newStatus: string) => void;
}

export const IncidentList = ({ incidents, onUpdateStatus }: IncidentListProps) => {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const incidentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - incidentTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-emergency text-white hover:bg-emergency/90";
      case "high": return "bg-destructive text-white hover:bg-destructive/90";
      case "medium": return "bg-warning text-black hover:bg-warning/90";
      case "low": return "bg-success text-white hover:bg-success/90";
      default: return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical": return "CRITICAL";
      case "high": return "HIGH";
      case "medium": return "MEDIUM";
      case "low": return "LOW";
      default: return "UNKNOWN";
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {incidents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No incidents reported</p>
        </div>
      ) : (
        incidents.map((incident) => (
          <Card key={incident.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      className={`${getSeverityColor(incident.severity)} text-xs`}
                    >
                      {getSeverityLabel(incident.severity)}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {incident.status}
                    </Badge>
                    <h3 className="font-medium text-sm capitalize">{incident.type}</h3>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{incident.location_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(incident.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{incident.responders_assigned} responder{incident.responders_assigned !== 1 ? 's' : ''}</span>
                    </div>
                    {incident.description && (
                      <p className="text-xs mt-2 text-foreground/80">{incident.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {onUpdateStatus && (
                    <Select
                      value={incident.status}
                      onValueChange={(value) => onUpdateStatus(incident.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="responding">Responding</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Button size="sm" variant="outline" className="text-xs">
                    View Details
                  </Button>
                  <Button size="sm" className="text-xs">
                    Dispatch Unit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};