import { LEVEL_THRESHOLDS } from "./levelconfig";

export function calculateLevel(points) {
  let currentLevel = 1;
  let progressPercent = 0;
  let nextLevelPoints = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length - 1; i++) {
    const start = LEVEL_THRESHOLDS[i];
    const next = LEVEL_THRESHOLDS[i + 1];

    if (points >= start && points < next) {
      currentLevel = i + 1;
      nextLevelPoints = next;

      progressPercent =
        ((points - start) / (next - start)) * 100;
      break;
    }

    // Max level case
    if (i === LEVEL_THRESHOLDS.length - 2 && points >= next) {
      currentLevel = LEVEL_THRESHOLDS.length;
      progressPercent = 100;
      nextLevelPoints = null;
    }
  }

  return {
    currentLevel,
    progressPercent: Math.min(Math.max(progressPercent, 0), 100),
    nextLevelPoints,
  };
}
