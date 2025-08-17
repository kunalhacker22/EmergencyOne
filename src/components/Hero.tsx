import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Phone } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative py-24 px-6 bg-gradient-hero border-b border-border">
      <div className="max-w-7xl mx-auto">
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
          <Button variant="default" size="lg" className="bg-gradient-emergency hover:opacity-90 transition-opacity">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Report Emergency
          </Button>
          <Button variant="secondary" size="lg">
            <Phone className="h-5 w-5 mr-2" />
            Control Center Access
          </Button>
        </div>
      </div>
    </section>
  );
};