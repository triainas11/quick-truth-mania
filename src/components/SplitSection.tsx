import { ReactNode } from "react";

interface SplitSectionProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  leftBg?: string;
  rightBg?: string;
}

const SplitSection = ({ leftContent, rightContent, leftBg = "gradient-primary", rightBg = "gradient-secondary" }: SplitSectionProps) => {
  return (
    <div className="grid md:grid-cols-2 min-h-[400px]">
      <div className={`${leftBg} p-8 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white">
          {leftContent}
        </div>
      </div>
      <div className={`${rightBg} p-8 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default SplitSection;