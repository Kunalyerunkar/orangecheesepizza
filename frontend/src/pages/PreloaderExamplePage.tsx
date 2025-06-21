import React, { useState } from "react";
import Button from "../components/common/Button";
import CursorDemo from "../components/common/CursorDemo";
import InlinePreloader from "../components/common/InlinePreloader";
import Preloader from "../components/common/Preloader";
import { usePreloader } from "../components/common/PreloaderProvider";

const PreloaderExamplePage = () => {
  const { showPreloader, hidePreloader } = usePreloader();
  const [isLoading, setIsLoading] = useState(false);

  const handleGlobalPreloader = (text: string) => {
    showPreloader(text);
    setTimeout(() => {
      hidePreloader();
    }, 3000);
  };

  const handleButtonLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="container page-container">
      <h1 className="text-3xl font-bold mb-8">Preloader & Cursor Components</h1>

      {/* Pizza Cursor Demo */}
      <div className="mb-8">
        <CursorDemo />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Global Preloader Examples */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Global Preloader</h2>
          <p className="mb-4">
            Click the buttons below to show a full-screen preloader overlay.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => handleGlobalPreloader("Loading...")}
              variant="primary"
            >
              Show Preloader
            </Button>
            <Button
              onClick={() => handleGlobalPreloader("Processing Order...")}
              variant="secondary"
            >
              Processing Order
            </Button>
            <Button
              onClick={() => handleGlobalPreloader("Updating Profile...")}
              variant="accent"
            >
              Updating Profile
            </Button>
          </div>
        </div>

        {/* Button with Loading State */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Buttons with Loading State</h2>
          <p className="mb-4">
            Examples of buttons with built-in loading indicators.
          </p>
          <div className="flex flex-col gap-4">
            <Button isLoading={isLoading} onClick={handleButtonLoading}>
              Click to Load
            </Button>
            <Button
              isLoading={isLoading}
              loadingText="Submitting..."
              onClick={handleButtonLoading}
              variant="secondary"
            >
              Submit Form
            </Button>
            <Button
              isLoading={isLoading}
              loadingText="Processing..."
              onClick={handleButtonLoading}
              variant="accent"
              fullWidth
            >
              Process Payment
            </Button>
            <Button
              isLoading={isLoading}
              onClick={handleButtonLoading}
              variant="outline"
            >
              Outline Button
            </Button>
          </div>
        </div>

        {/* Inline Preloader Examples */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Inline Preloaders</h2>
          <p className="mb-4">
            Small loading indicators that can be used inline with text.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Extra Small:</span>
              <InlinePreloader size="xs" />
            </div>
            <div className="flex items-center gap-2">
              <span>Small:</span>
              <InlinePreloader size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <span>Medium:</span>
              <InlinePreloader size="md" />
            </div>
            <div className="flex items-center gap-2">
              <span>Primary Color:</span>
              <InlinePreloader color="primary" />
            </div>
            <div className="flex items-center gap-2">
              <span>Secondary Color:</span>
              <InlinePreloader color="secondary" />
            </div>
            <div className="flex items-center gap-2">
              <span>Accent Color:</span>
              <InlinePreloader color="accent" />
            </div>
            <div className="p-2 bg-primary rounded">
              <div className="flex items-center gap-2">
                <span className="text-white">White:</span>
                <InlinePreloader color="white" />
              </div>
            </div>
          </div>
        </div>

        {/* Component Preloader Examples */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Component Preloaders</h2>
          <p className="mb-4">Preloaders that can be used within components.</p>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-500 mb-2">Small Preloader:</p>
              <Preloader fullScreen={false} size="sm" />
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-500 mb-2">Medium Preloader:</p>
              <Preloader fullScreen={false} size="md" />
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-500 mb-2">
                Large Preloader with Text:
              </p>
              <Preloader
                fullScreen={false}
                size="lg"
                text="Loading content..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreloaderExamplePage;
