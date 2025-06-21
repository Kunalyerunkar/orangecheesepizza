import React from "react";

interface InlinePreloaderProps {
  size?: "xs" | "sm" | "md";
  color?: "primary" | "secondary" | "accent" | "white";
  className?: string;
}

const InlinePreloader: React.FC<InlinePreloaderProps> = ({
  size = "sm",
  color = "primary",
  className = "",
}) => {
  // Size configurations
  const sizeConfig = {
    xs: "h-3 w-3 border-t-1 border-b-1",
    sm: "h-4 w-4 border-t-2 border-b-2",
    md: "h-6 w-6 border-t-2 border-b-2",
  };

  // Color configurations
  const colorConfig = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
    white: "border-white",
  };

  return (
    <div className={`inline-flex ${className}`}>
      <div className="relative">
        <div
          className={`animate-spin rounded-full ${sizeConfig[size]} ${colorConfig[color]}`}
        ></div>
      </div>
    </div>
  );
};

export default InlinePreloader;
