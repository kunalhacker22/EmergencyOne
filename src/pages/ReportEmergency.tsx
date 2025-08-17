import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReportEmergency = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    locationName: "",
    latitude: "",
    longitude: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
    additionalNotes: ""
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          toast({
            title: "Location captured",
            description: "Your current location has been added to the report."
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.severity || !formData.locationName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create incident
      const { data: incident, error: incidentError } = await supabase
        .from("incidents")
        .insert({
          type: formData.type,
          severity: formData.severity,
          location_name: formData.locationName,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
          description: formData.description,
          responders_assigned: 0
        })
        .select()
        .single();

      if (incidentError) throw incidentError;

      // Create emergency report
      const { error: reportError } = await supabase
        .from("emergency_reports")
        .insert({
          incident_id: incident.id,
          reporter_name: formData.reporterName || null,
          reporter_phone: formData.reporterPhone || null,
          additional_notes: formData.additionalNotes || null
        });

      if (reportError) throw reportError;

      toast({
        title: "Emergency reported successfully",
        description: "Your emergency report has been submitted. Help is on the way."
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission failed",
        description: "Could not submit your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-emergency">
          <CardHeader className="bg-emergency/5">
            <CardTitle className="flex items-center gap-2 text-emergency">
              <AlertTriangle className="w-6 h-6" />
              Report Emergency
            </CardTitle>
            <CardDescription>
              Provide details about the emergency incident. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Incident Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collision">Vehicle Collision</SelectItem>
                      <SelectItem value="breakdown">Vehicle Breakdown</SelectItem>
                      <SelectItem value="debris">Road Debris</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity Level *</Label>
                  <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor incident</SelectItem>
                      <SelectItem value="medium">Medium - Moderate impact</SelectItem>
                      <SelectItem value="high">High - Serious incident</SelectItem>
                      <SelectItem value="critical">Critical - Life threatening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="locationName">Location Description *</Label>
                <Input
                  id="locationName"
                  placeholder="e.g., Highway 101 Mile 23, near Exit 45"
                  value={formData.locationName}
                  onChange={(e) => setFormData({...formData, locationName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="37.7749"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="-122.4194"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  />
                </div>
              </div>

              <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Use My Current Location
              </Button>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened and any immediate dangers..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3">Contact Information (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reporterName">Your Name</Label>
                    <Input
                      id="reporterName"
                      placeholder="Full name"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporterPhone">Phone Number</Label>
                    <Input
                      id="reporterPhone"
                      placeholder="(555) 123-4567"
                      value={formData.reporterPhone}
                      onChange={(e) => setFormData({...formData, reporterPhone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any other relevant information..."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Submitting..." : "Submit Emergency Report"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/")} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportEmergency;