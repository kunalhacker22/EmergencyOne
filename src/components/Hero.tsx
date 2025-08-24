import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 bg-hero-animated bg-mesh-pattern border-b overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-foreground">
              Emergency<span className="text-primary">One</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced emergency response system for highway accidents. 
            Minimizing response times and saving lives through real-time coordination 
            and intelligent incident management.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emergency-critical to-emergency-warning text-white glow-emergency hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/report")}
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Report Emergency
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-emergency-info text-emergency-info hover:bg-emergency-info hover:text-background backdrop-blur-sm bg-white/5 hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/auth")}
          >
            <Phone className="h-5 w-5 mr-2" />
            Control Center Access
          </Button>
        </div>
      </div>
    </section>
  );
};