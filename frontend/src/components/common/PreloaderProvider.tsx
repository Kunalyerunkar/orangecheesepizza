import React, { createContext, ReactNode, useContext, useState } from "react";
import useCursor from "../../hooks/useCursor";
import Preloader from "./Preloader";

interface PreloaderContextType {
  showPreloader: (text?: string) => void;
  hidePreloader: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(
  undefined
);

interface PreloaderProviderProps {
  children: ReactNode;
}

export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);
  const { setLoading: setLoadingCursor, setDefault: setDefaultCursor } =
    useCursor();

  const showPreloader = (text?: string) => {
    setLoadingText(text);
    setLoading(true);
    setLoadingCursor();
  };

  const hidePreloader = () => {
    setLoading(false);
    setDefaultCursor();
  };

  return (
    <PreloaderContext.Provider value={{ showPreloader, hidePreloader }}>
      {children}
      {loading && <Preloader fullScreen={true} size="lg" text={loadingText} />}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = (): PreloaderContextType => {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
};

export default PreloaderProvider;
