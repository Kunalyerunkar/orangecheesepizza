import React, { useEffect, useState } from "react";

interface PizzaPreloaderProps {
  minDisplayTime?: number; // Minimum time to display the preloader in milliseconds
  onComplete?: () => void; // Callback when preloader is done
}

const PizzaPreloader: React.FC<PizzaPreloaderProps> = ({
  minDisplayTime = 3000, // Default minimum display time: 3 seconds
  onComplete,
}) => {
  const [activeSlices, setActiveSlices] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6, 7,
  ]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ensure preloader shows for at least the minimum time
    const minTimeTimer = setTimeout(() => {
      // Start removing slices one by one
      const removeSlices = () => {
        let currentSlices = [...activeSlices];

        const interval = setInterval(() => {
          if (currentSlices.length > 0) {
            currentSlices = currentSlices.slice(0, -1);
            setActiveSlices(currentSlices);
          } else {
            clearInterval(interval);
            // Hide the preloader completely after all slices are gone
            setTimeout(() => {
              setIsVisible(false);
              // Call the onComplete callback if provided
              if (onComplete) {
                onComplete();
              }
            }, 500);
          }
        }, 300); // Remove a slice every 300ms

        return () => clearInterval(interval);
      };

      removeSlices();
    }, minDisplayTime);

    return () => clearTimeout(minTimeTimer);
  }, [minDisplayTime, onComplete]);

  // If not visible, don't render anything
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 z-50">
      <div className="relative w-96 h-96">
        {/* Pizza container */}
        <div className="relative w-full h-full">
          {/* Pizza slices - using the provided image */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((slice) => {
            const angle = slice * 45; // 45 degrees per slice (360 / 8)
            const isActive = activeSlices.includes(slice);

            return (
              <div
                key={slice}
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "center",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.3s ease-out",
                }}
              >
                <div
                  className="absolute top-0 left-1/2 w-1/2 h-1/2"
                  style={{
                    backgroundImage: `url('/images/00873bd4358260dc018af1600a7d57.webp')`,
                    backgroundSize: "contain",
                    backgroundPosition: "top center",
                    backgroundRepeat: "no-repeat",
                    transformOrigin: "bottom left",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            );
          })}

          {/* Pizza center */}
          <div className="absolute inset-[40%] rounded-full bg-amber-800 bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg">OCP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaPreloader;
