import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, AlertTriangle, Users, Phone } from "lucide-react";

interface Incident {
  id: string;
  type: string;
  severity: string;
  status: string;
  location_name: string;
  latitude: number;
  longitude: number;
  created_at: string;
  responders_assigned: number;
  description?: string;
}

interface IncidentDetailsModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchUnit: (incidentId: string) => void;
}

export const IncidentDetailsModal = ({ 
  incident, 
  isOpen, 
  onClose, 
  onDispatchUnit 
}: IncidentDetailsModalProps) => {
  if (!incident) return null;

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-emergency text-emergency-foreground";
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-accent text-accent-foreground";
      case "low": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emergency text-emergency-foreground";
      case "responding": return "bg-accent text-accent-foreground";
      case "resolved": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-emergency" />
            Incident Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={getSeverityColor(incident.severity)}>
              {incident.severity.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={getStatusColor(incident.status)}>
              {incident.status.toUpperCase()}
            </Badge>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="font-medium">{incident.type}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="font-medium">{incident.location_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Reported:</span>
                <span className="font-medium">{formatTimeAgo(incident.created_at)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Responders:</span>
                <span className="font-medium">{incident.responders_assigned} assigned</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span>Coordinates:</span>
                <div className="font-mono text-xs mt-1">
                  {incident.latitude.toFixed(6)}, {incident.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {incident.description && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Separator />
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => onDispatchUnit(incident.id)}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Dispatch Additional Unit
            </Button>
            
            <Button variant="outline" asChild>
              <a 
                href={`https://maps.google.com/?q=${incident.latitude},${incident.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                View on Maps
              </a>
            </Button>
            
            <Button variant="outline" asChild>
              <a 
                href={`tel:911`}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contact Emergency Services
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};