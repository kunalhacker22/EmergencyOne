import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { StatsOverview } from "@/components/StatsOverview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <StatsOverview />
      <Dashboard />
    </div>
  );
};

export default Index;