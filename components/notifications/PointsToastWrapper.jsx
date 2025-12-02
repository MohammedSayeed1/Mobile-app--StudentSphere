import React from "react";
import PointsToast from "./pointsToast";
import { useToast } from "./toastContext";

export default function PointsToastWrapper() {
  const { pointsToast } = useToast();

  return (
    <PointsToast
      visible={pointsToast.visible}
      pointsAdded={pointsToast.pointsAdded}
      totalPoints={pointsToast.totalPoints}
    />
  );
}
