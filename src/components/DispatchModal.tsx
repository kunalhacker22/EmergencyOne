import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Clock, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Responder {
  id: string;
  name: string;
  type: string;
  status: string;
  current_location_lat?: number;
  current_location_lng?: number;
}

interface DispatchModalProps {
  incidentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchComplete: () => void;
}

export const DispatchModal = ({ 
  incidentId, 
  isOpen, 
  onClose, 
  onDispatchComplete 
}: DispatchModalProps) => {
  const { toast } = useToast();
  const [responders, setResponders] = useState<Responder[]>([]);
  const [selectedResponder, setSelectedResponder] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableResponders();
    }
  }, [isOpen]);

  const fetchAvailableResponders = async () => {
    const { data, error } = await supabase
      .from("responders")
      .select("*")
      .eq("status", "available")
      .order("name");

    if (error) {
      console.error("Error fetching responders:", error);
      toast({
        title: "Error loading responders",
        description: "Unable to fetch available responders.",
        variant: "destructive"
      });
    } else {
      setResponders(data || []);
    }
  };

  const handleDispatch = async () => {
    if (!selectedResponder || !incidentId) return;

    setLoading(true);
    try {
      // Update responder status to "en_route"
      const { error: responderError } = await supabase
        .from("responders")
        .update({ status: "en_route" })
        .eq("id", selectedResponder);

      if (responderError) throw responderError;

      // Update incident responders count manually
      const { data: incident } = await supabase
        .from("incidents")
        .select("responders_assigned")
        .eq("id", incidentId)
        .single();

      if (incident) {
        await supabase
          .from("incidents")
          .update({ responders_assigned: (incident.responders_assigned || 0) + 1 })
          .eq("id", incidentId);
      }

      toast({
        title: "Unit dispatched successfully",
        description: "Responder has been assigned to the incident."
      });

      onDispatchComplete();
      onClose();
      setSelectedResponder("");
    } catch (error: any) {
      console.error("Dispatch error:", error);
      toast({
        title: "Dispatch failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getResponderTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "fire": return "bg-emergency text-emergency-foreground";
      case "police": return "bg-blue-600 text-white";
      case "ems": return "bg-green-600 text-white";
      case "medical": return "bg-green-600 text-white";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emergency" />
            Dispatch Unit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Select an available responder to dispatch to this incident:
          </div>

          {responders.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">
                  No available responders at this time
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <Select value={selectedResponder} onValueChange={setSelectedResponder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a responder..." />
                </SelectTrigger>
                <SelectContent>
                  {responders.map((responder) => (
                    <SelectItem key={responder.id} value={responder.id}>
                      <div className="flex items-center gap-2">
                        <span>{responder.name}</span>
                        <Badge 
                          className={`text-xs ${getResponderTypeColor(responder.type)}`}
                        >
                          {responder.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedResponder && (
                <Card>
                  <CardContent className="p-3">
                    {(() => {
                      const responder = responders.find(r => r.id === selectedResponder);
                      if (!responder) return null;

                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{responder.name}</span>
                            <Badge className={getResponderTypeColor(responder.type)}>
                              {responder.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Status: Available</span>
                          </div>
                          {responder.current_location_lat && responder.current_location_lng && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>
                                Location: {responder.current_location_lat.toFixed(4)}, {responder.current_location_lng.toFixed(4)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Separator />

          <div className="flex gap-3">
            <Button 
              onClick={handleDispatch}
              disabled={!selectedResponder || loading || responders.length === 0}
              className="flex-1"
            >
              {loading ? "Dispatching..." : "Dispatch Unit"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};