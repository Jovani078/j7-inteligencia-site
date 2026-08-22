"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type PreloadState = {
  ready: boolean;
  setReady: (ready: boolean) => void;
};

const PreloadContext = createContext<PreloadState | null>(null);

export function PreloadProvider({ children }: { children: ReactNode }) {
  // Starts false to match SSR output; Preloader flips it in a useEffect
  // (client-only, post-hydration), same guard pattern as every other
  // reduced-motion check in this codebase.
  const [ready, setReady] = useState(false);

  return (
    <PreloadContext.Provider value={{ ready, setReady }}>
      {children}
    </PreloadContext.Provider>
  );
}

export function usePreload() {
  const ctx = useContext(PreloadContext);
  if (!ctx) {
    throw new Error("usePreload must be used within a PreloadProvider");
  }
  return ctx;
}