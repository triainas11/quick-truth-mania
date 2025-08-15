import { ReactNode } from "react";

interface GameFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

const GameFeature = ({ icon, title, description, className = "" }: GameFeatureProps) => {
  return (
    <div className={`group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:scale-105 ${className}`}>
      <div className="flex items-center gap-4 mb-3">
        <div className="p-3 rounded-lg gradient-secondary shadow-neon group-hover:animate-pulse-slow">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default GameFeature;