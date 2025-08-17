import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, RefreshCw, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dashboard } from "@/components/Dashboard";

interface ControlUser {
  id: string;
  name: string;
  role: string;
}

const ControlCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [controlUser, setControlUser] = useState<ControlUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Get control user profile
      const { data: controlUserData, error } = await supabase
        .from("control_users")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching control user:", error);
        toast({
          title: "Access denied",
          description: "You don't have permission to access the control center.",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }

      setControlUser(controlUserData);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the control center."
      });
      navigate("/");
    }
  };

  const handleUpdateIncidentStatus = async (incidentId: string, newStatus: string) => {
    const { error } = await supabase
      .from("incidents")
      .update({ status: newStatus })
      .eq("id", incidentId);

    if (error) {
      toast({
        title: "Update failed",
        description: "Could not update incident status.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Status updated",
        description: `Incident status changed to ${newStatus}.`
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Control Center Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-emergency">EmergencyOne Control Center</h1>
            {controlUser && (
              <Badge variant="outline" className="border-emergency text-emergency">
                {controlUser.role.toUpperCase()}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="w-4 h-4" />
              <span>{controlUser?.name || user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <Dashboard onUpdateIncidentStatus={handleUpdateIncidentStatus} />
      </main>
    </div>
  );
};

export default ControlCenter;