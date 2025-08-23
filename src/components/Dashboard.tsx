import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { IncidentList } from "./IncidentList";
import { MetricsTabs } from "./MetricsTabs";

interface DashboardProps {
  onUpdateIncidentStatus?: (incidentId: string, newStatus: string) => void;
}

export const Dashboard = ({ onUpdateIncidentStatus }: DashboardProps) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [responders, setResponders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
    fetchResponders();

    // Set up real-time subscription for incidents
    const channel = supabase
      .channel('incidents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents'
        },
        () => {
          fetchIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching incidents:", error);
    } else {
      setIncidents(data || []);
    }
    setLoading(false);
  };

  const fetchResponders = async () => {
    const { data, error } = await supabase
      .from("responders")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching responders:", error);
    } else {
      setResponders(data || []);
    }
  };

  const getResponderCounts = () => {
    const available = responders.filter(r => r.status === 'available').length;
    const enRoute = responders.filter(r => r.status === 'en_route').length;
    const onScene = responders.filter(r => r.status === 'on_scene').length;
    return { available, enRoute, onScene };
  };

  const { available, enRoute, onScene } = getResponderCounts();

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Real-Time Emergency Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitor active incidents, coordinate response teams, and track emergency status across the highway network.
          </p>
        </div>

        <MetricsTabs incidents={incidents} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Recent Incidents ({incidents.slice(0, 5).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IncidentList incidents={incidents.slice(0, 5)} onUpdateStatus={onUpdateIncidentStatus} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-success" />
                Response Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Units</span>
                  <Badge variant="secondary">{available}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">En Route</span>
                  <Badge variant="outline" className="border-warning text-warning">{enRoute}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">On Scene</span>
                  <Badge variant="outline" className="border-emergency text-emergency">{onScene}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};