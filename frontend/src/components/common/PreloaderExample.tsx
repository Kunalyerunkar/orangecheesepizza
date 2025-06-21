import React from "react";
import { usePreloader } from "./PreloaderProvider";

interface PreloaderExampleProps {
  delay?: number;
}

const PreloaderExample: React.FC<PreloaderExampleProps> = ({
  delay = 3000,
}) => {
  const { showPreloader, hidePreloader } = usePreloader();

  const handleShowPreloader = (text?: string) => {
    showPreloader(text);

    // Hide the preloader after the specified delay
    setTimeout(() => {
      hidePreloader();
    }, delay);
  };

  return (
    <div className="p-4 card">
      <h3 className="text-lg font-medium mb-4">Preloader Examples</h3>

      <div className="flex flex-wrap gap-4">
        <button
          className="btn btn-primary"
          onClick={() => handleShowPreloader("Loading...")}
        >
          Show Preloader
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => handleShowPreloader("Processing your order...")}
        >
          Processing Order
        </button>

        <button
          className="btn btn-accent"
          onClick={() => handleShowPreloader("Updating your profile...")}
        >
          Update Profile
        </button>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-medium mb-2">Inline Preloader Examples:</h4>
        <div className="flex items-center gap-6 mt-4">
          <div>
            <p className="mb-2">Small:</p>
            <div className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2">
                <span>Loading</span>
                <div className="inline-block">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2">Medium:</p>
            <div className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2">
                <span>Processing</span>
                <div className="inline-block">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-secondary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreloaderExample;
