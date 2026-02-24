"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import ErrorModal from "@/components/ErrorModal";


type ErrorContextType = {
  showError: (message: string) => void;
  clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | null>(null);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}

      {/* 🔥 SINGLE GLOBAL MODAL */}
      <ErrorModal message={error} onClose={clearError} />
    </ErrorContext.Provider>
  );
}

/* =============================
   HOOK
============================= */
export function useError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    throw new Error("useError must be used inside ErrorProvider");
  }
  return ctx;
}