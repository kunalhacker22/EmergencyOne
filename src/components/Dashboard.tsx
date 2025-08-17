import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentMap } from "@/components/IncidentMap";
import { IncidentList } from "@/components/IncidentList";
import { MapPin, Clock, Users, AlertCircle } from "lucide-react";

export const Dashboard = () => {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Incident Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <IncidentMap />
              </CardContent>
            </Card>
          </div>

          {/* Incident List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                  Active Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IncidentList />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Response Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available Units</span>
                  <span className="font-semibold text-emergency-safe">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">En Route</span>
                  <span className="font-semibold text-emergency-warning">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">On Scene</span>
                  <span className="font-semibold text-emergency-critical">2</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};