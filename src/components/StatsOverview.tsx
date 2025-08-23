import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Clock, MapPin, Shield } from "lucide-react";

export const StatsOverview = () => {
  const stats = [
    {
      title: "Average Response Time",
      value: "4.2 min",
      change: "-15%",
      icon: Clock,
      positive: true
    },
    {
      title: "Active Incidents",
      value: "7",
      change: "+2",
      icon: MapPin,
      positive: false
    },
    {
      title: "Lives Saved This Month",
      value: "142",
      change: "+23%",
      icon: Shield,
      positive: true
    },
    {
      title: "Response Efficiency",
      value: "94.8%",
      change: "+5.2%",
      icon: TrendingDown,
      positive: true
    }
  ];

  return (
    <section className="py-12 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <stat.icon className="h-4 w-4 mr-2" />
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.positive ? "text-emergency-safe" : "text-emergency-warning"
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};