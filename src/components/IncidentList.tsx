import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, AlertTriangle, Users, Eye, Truck } from "lucide-react";
import { IncidentDetailsModal } from "./IncidentDetailsModal";
import { DispatchModal } from "./DispatchModal";

interface Incident {
  id: string;
  type: string;
  location_name: string;
  created_at: string;
  severity: string;
  responders_assigned: number;
  status: string;
  description?: string;
  latitude: number;
  longitude: number;
}

interface IncidentListProps {
  incidents: Incident[];
  onUpdateStatus?: (incidentId: string, newStatus: string) => void;
}

export const IncidentList = ({ incidents, onUpdateStatus }: IncidentListProps) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchIncidentId, setDispatchIncidentId] = useState<string | null>(null);

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDetailsModalOpen(true);
  };

  const handleDispatchUnit = (incidentId: string) => {
    setDispatchIncidentId(incidentId);
    setIsDispatchModalOpen(true);
  };

  const handleDispatchComplete = () => {
    // Refresh the incidents list or trigger a callback
    // This would typically trigger a re-fetch of incidents
  };

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
      case "medium": return "bg-accent text-accent-foreground hover:bg-accent/90";
      case "low": return "bg-secondary text-secondary-foreground hover:bg-secondary/90";
      default: return "bg-muted text-muted-foreground hover:bg-muted/80";
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
    <>
      <div className="space-y-4">
        {incidents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Active Incidents</h3>
              <p className="text-sm text-muted-foreground">
                All incidents have been resolved or there are no current emergencies.
              </p>
            </CardContent>
          </Card>
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

                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewDetails(incident)}
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleDispatchUnit(incident.id)}
                      >
                        <Truck className="w-3 h-3" />
                        Dispatch Unit
                      </Button>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <IncidentDetailsModal
        incident={selectedIncident}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onDispatchUnit={handleDispatchUnit}
      />

      <DispatchModal
        incidentId={dispatchIncidentId}
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onDispatchComplete={handleDispatchComplete}
      />
    </>
  );
};