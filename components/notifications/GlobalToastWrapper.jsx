import React from "react";
import { useToast } from "./toastContext";
import PointsToast from "./pointsToast";
import MessageToast from "./pointsToast";

export default function GlobalToastWrapper() {
  const { toast } = useToast();

  if (!toast.visible) return null;

  if (toast.type === "points") {
    return (
      <PointsToast
        visible={true}
        pointsAdded={toast.pointsAdded}
        totalPoints={toast.totalPoints}
      />
    );
  }

  return <MessageToast visible={true} message={toast.message} />;
}
