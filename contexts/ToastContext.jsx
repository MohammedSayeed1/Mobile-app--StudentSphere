import { createContext, useContext, useState } from "react";
import PointsToast from "../components/notifications/pointsToast"; // <-- update path if needed

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toastData, setToastData] = useState({
    visible: false,
    pointsAdded: 0,
    totalPoints: 0,
  });

  const showToast = (pointsAdded, totalPoints) => {
    setToastData({
      visible: true,
      pointsAdded,
      totalPoints,
    });
  };

  const hideToast = () => {
    setToastData((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Global Points Toast */}
      <PointsToast
        visible={toastData.visible}
        pointsAdded={toastData.pointsAdded}
        totalPoints={toastData.totalPoints}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
