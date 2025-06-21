import React from "react";
import useCursor from "../../hooks/useCursor";
import { usePreloader } from "./PreloaderProvider";

const CursorDemo: React.FC = () => {
  const { showPreloader, hidePreloader } = usePreloader();
  const { setLoading, setDefault } = useCursor();

  const handleShowLoading = () => {
    setLoading();
    setTimeout(() => {
      setDefault();
    }, 3000);
  };

  const handleShowPreloader = () => {
    showPreloader("Loading with pizza cursor...");
    setTimeout(() => {
      hidePreloader();
    }, 3000);
  };

  return (
    <div className="p-6 card">
      <h2 className="text-xl font-bold mb-4">Pizza Cursor Demo</h2>

      <div className="mb-4">
        <p className="mb-2">
          Move your cursor around to see the pizza slice cursor in action!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-md hover:border-primary transition-colors">
          <h3 className="font-medium mb-2">Interactive Elements</h3>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary">Button</button>
            <a href="#" className="btn btn-outline">
              Link
            </a>
            <input type="text" placeholder="Input field" className="input" />
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md hover:border-primary transition-colors">
          <h3 className="font-medium mb-2">Loading Cursor</h3>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={handleShowLoading}>
              Show Loading Cursor
            </button>

            <button className="btn btn-secondary" onClick={handleShowPreloader}>
              Show Preloader
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Pizza Cursor Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            The detailed pizza slice cursor is applied to the entire application
          </li>
          <li>
            Interactive elements like buttons and links show the pizza cursor
          </li>
          <li>During loading states, the pizza cursor spins</li>
          <li>Using .cur format for optimal browser compatibility</li>
          <li>
            The pizza image features realistic cheese, tomatoes, basil, and
            olives
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CursorDemo;
