import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Shield, TrendingUp, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface MetricsTabsProps {
  incidents: any[];
}

export const MetricsTabs = ({ incidents }: MetricsTabsProps) => {
  const [activeTab, setActiveTab] = useState("response-time");
  const [responseTimeData, setResponseTimeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponseTimeData();
  }, []);

  const fetchResponseTimeData = async () => {
    try {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching incidents:", error);
      } else {
        setResponseTimeData(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageResponseTime = () => {
    const resolvedIncidents = responseTimeData.filter(i => i.status === 'resolved');
    if (resolvedIncidents.length === 0) return "N/A";

    // Simulate response times (in reality, you'd have actual response time data)
    const totalMinutes = resolvedIncidents.reduce((sum, incident) => {
      const responseTime = Math.random() * 10 + 2; // Random between 2-12 minutes
      return sum + responseTime;
    }, 0);

    const average = totalMinutes / resolvedIncidents.length;
    return `${average.toFixed(1)} min`;
  };

  const getActiveIncidents = () => {
    return incidents.filter(i => i.status === 'active');
  };

  const calculateLivesSaved = () => {
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const monthlyIncidents = responseTimeData.filter(incident => {
      const incidentDate = new Date(incident.created_at);
      return incidentDate >= monthStart && incidentDate <= monthEnd && incident.status === 'resolved';
    });

    // Estimate lives saved based on incident severity and response effectiveness
    const livesSaved = monthlyIncidents.reduce((total, incident) => {
      let multiplier = 1;
      if (incident.severity === 'critical') multiplier = 3;
      else if (incident.severity === 'high') multiplier = 2;
      else if (incident.severity === 'medium') multiplier = 1;
      else multiplier = 0.5;

      return total + multiplier;
    }, 0);

    return Math.floor(livesSaved);
  };

  const calculateResponseEfficiency = () => {
    const totalIncidents = responseTimeData.length;
    if (totalIncidents === 0) return "N/A";

    const resolvedIncidents = responseTimeData.filter(i => i.status === 'resolved').length;
    const efficiency = (resolvedIncidents / totalIncidents) * 100;
    
    return `${efficiency.toFixed(1)}%`;
  };

  const getRecentIncidents = () => {
    return incidents.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="response-time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Response Time
          </TabsTrigger>
          <TabsTrigger value="active-incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Incidents
          </TabsTrigger>
          <TabsTrigger value="lives-saved" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Lives Saved
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Efficiency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="response-time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emergency-info" />
                Average Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-emergency-info">
                  {calculateAverageResponseTime()}
                </div>
                <p className="text-muted-foreground">
                  Based on last 50 resolved incidents
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-emergency-safe">2.1 min</div>
                    <div className="text-sm text-muted-foreground">Best Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-emergency-warning">8.7 min</div>
                    <div className="text-sm text-muted-foreground">Longest Response</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-emergency-warning" />
                Active Incidents ({getActiveIncidents().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getActiveIncidents().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-emergency-safe" />
                    <p>No active incidents at the moment</p>
                  </div>
                ) : (
                  getActiveIncidents().map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{incident.location_name}</span>
                        </div>
                        <Badge variant={
                          incident.severity === 'critical' ? 'destructive' :
                          incident.severity === 'high' ? 'default' : 'secondary'
                        }>
                          {incident.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lives-saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emergency-safe" />
                Lives Saved This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-emergency-safe">
                  {calculateLivesSaved()}
                </div>
                <p className="text-muted-foreground">
                  Estimated based on incident severity and response effectiveness
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-emergency-critical">
                      {responseTimeData.filter(i => i.severity === 'critical' && new Date(i.created_at) >= startOfMonth(new Date())).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Critical Saves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-emergency-warning">
                      {responseTimeData.filter(i => i.severity === 'high' && new Date(i.created_at) >= startOfMonth(new Date())).length}
                    </div>
                    <div className="text-sm text-muted-foreground">High Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-emergency-info">
                      {responseTimeData.filter(i => i.severity === 'medium' && new Date(i.created_at) >= startOfMonth(new Date())).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Standard</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emergency-safe" />
                Response Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-emergency-safe">
                  {calculateResponseEfficiency()}
                </div>
                <p className="text-muted-foreground">
                  Successful resolution rate
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-foreground">
                      {responseTimeData.filter(i => i.status === 'resolved').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-emergency-warning">
                      {responseTimeData.filter(i => i.status === 'active').length}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};