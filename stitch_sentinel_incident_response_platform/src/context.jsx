import { createContext, useContext } from "react";

export const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe utilizarse dentro de AppContext.");
  return context;
}
