import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    type: "message", // "message" | "points"
    message: "",
    pointsAdded: 0,
    totalPoints: 0,
  });

  const showToast = (options) => {
    setToast({
      visible: true,
      type: options.type || "message",
      message: options.message || "",
      pointsAdded: options.pointsAdded || 0,
      totalPoints: options.totalPoints || 0,
    });

    // Auto hide
    setTimeout(() => {
      hideToast();
    }, options.duration || 2500);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
