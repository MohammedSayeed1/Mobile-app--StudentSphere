import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import rewardsBg from "../assets/images/levelbg.jpg";

export default function PointsLevelCard({
  userPoints,
  levelData,
}) {
  const { currentLevel, progressPercent, nextLevelPoints } = levelData;

  const leftLevel = currentLevel;
  const rightLevel = nextLevelPoints ? currentLevel + 1 : null;

  return (
    <ImageBackground
    source={rewardsBg}
    style={styles.card}
    imageStyle={styles.bgImage}
  >
      {/* ---------- HEADER ---------- */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.points}>{userPoints} pts</Text>
          <Text style={styles.levelText}>Level {currentLevel}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          {nextLevelPoints ? (
            <Text style={styles.nextText}>
              Next at {nextLevelPoints} pts
            </Text>
          ) : (
            <Text style={styles.nextText}>Max level reached</Text>
          )}
        </View>
      </View>

      {/* ---------- PROGRESS TRACK ---------- */}
      <View style={styles.trackWrapper}>
        {/* Left Checkpoint */}
        <View style={styles.checkpoint}>
          <View style={styles.activeDot}>
            <Text style={styles.check}>✓</Text>
          </View>
          <Text style={styles.levelNumber}>{leftLevel}</Text>
        </View>

        {/* Track */}
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>

        {/* Right Checkpoint */}
        <View style={styles.checkpoint}>
          <View style={styles.inactiveDot} />
          {rightLevel && (
            <Text style={styles.levelNumber}>{rightLevel}</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    overflow: "hidden", // 🔥 REQUIRED for rounded bg image
  },
  
  bgImage: {
    borderRadius: 16,
    opacity: 0.92, // optional – makes text readable
  },
  

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  points: {
    fontSize: 28,
    color: "#FFFFFF", // better contrast
    fontFamily:"Gilroy-Bold"
  },
  
  levelText: {
    fontSize: 14,
    color: "#E0E0E0",
    fontFamily:"Gilroy-Bold"
  },
  
  nextText: {
    fontSize: 13,
    fontFamily:"Gilroy-Bold",
    color: "#FFFFFF",
  },
  

  /* ---------- TRACK ---------- */

  trackWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkpoint: {
    alignItems: "center",
    width: 50,
  },

  activeDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#001F3D",
    alignItems: "center",
    justifyContent: "center",
  },

  inactiveDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#001F3D",
    backgroundColor: "#FFF",
  },

  check: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  levelNumber: {
    marginTop: 6,
    fontSize: 12,
    color: "#8B7A45",
  },

  track: {
    flex: 1,
    height: 6,
    backgroundColor: "#E6E6E6",
    borderRadius: 3,
    overflow: "hidden",
    marginHorizontal: 6,
  },

  fill: {
    height: 6,
    backgroundColor: "#001F3D",
  },
});
