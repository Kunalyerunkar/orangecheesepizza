import { useCallback, useEffect, useState } from "react";

type CursorType = "default" | "pointer" | "loading";

export const useCursor = () => {
  const [cursorType, setCursorType] = useState<CursorType>("default");

  // Apply cursor class to body element
  useEffect(() => {
    const body = document.body;

    // Remove all cursor classes first
    body.classList.remove("pizza-cursor-loading");

    // Apply the appropriate class based on cursor type
    if (cursorType === "loading") {
      body.classList.add("pizza-cursor-loading");
    }

    return () => {
      body.classList.remove("pizza-cursor-loading");
    };
  }, [cursorType]);

  const setLoading = useCallback(() => {
    setCursorType("loading");
  }, []);

  const setDefault = useCallback(() => {
    setCursorType("default");
  }, []);

  const setPointer = useCallback(() => {
    setCursorType("pointer");
  }, []);

  return {
    cursorType,
    setLoading,
    setDefault,
    setPointer,
    isLoading: cursorType === "loading",
  };
};

export default useCursor;
