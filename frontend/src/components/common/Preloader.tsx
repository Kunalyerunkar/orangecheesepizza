import React from "react";

interface PreloaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const Preloader: React.FC<PreloaderProps> = ({
  fullScreen = true,
  size = "md",
  text,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      outer: "h-8 w-8",
      inner: "h-3 w-3",
      center: "h-2 w-2",
      border: "border-t-2 border-b-2",
    },
    md: {
      outer: "h-12 w-12",
      inner: "h-4 w-4",
      center: "h-2 w-2",
      border: "border-t-3 border-b-3",
    },
    lg: {
      outer: "h-16 w-16",
      inner: "h-6 w-6",
      center: "h-4 w-4",
      border: "border-t-4 border-b-4",
    },
  };

  const selectedSize = sizeConfig[size];

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50"
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Main spinner */}
          <div
            className={`animate-spin rounded-full ${selectedSize.outer} ${selectedSize.border} border-primary`}
          ></div>

          {/* Inner spinner */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping">
            <div
              className={`${selectedSize.inner} rounded-full bg-primary-light opacity-75`}
            ></div>
          </div>

          {/* Pizza logo in the center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div
              className={`${selectedSize.center} rounded-full bg-accent`}
            ></div>
          </div>
        </div>

        {/* Optional loading text */}
        {text && (
          <div className="mt-4 text-center">
            <p
              className={`${
                fullScreen ? "text-white" : "text-gray-800"
              } font-medium`}
            >
              {text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preloader;
