import React from "react";
import { View, StyleSheet } from "react-native";
import GridButton from "./GridButton";

export default function RewardsGrid() {
  return (
    <View style={styles.grid}>
      <GridButton
        title="Daily / Weekly"
        subtitle="Missions"
        bgColor="#D1FAE5"   // pastel blue
      />

      <GridButton
        title="Achievements"
        subtitle="Badges"
        bgColor="#DCFCE7"   // pastel peach
      />

      <GridButton
        title="Streak"
        subtitle="Keep it up"
        bgColor="#FFEDD5"   // pastel green
      />

      <GridButton
        title="Point History"
        subtitle="All transactions"
        bgColor="#FCE7F3"   // pastel lavender
      />

      <GridButton
        title="XP"
        subtitle="Experience"
        bgColor="#DBEAFE"   // pastel yellow
      />

      <GridButton
        title="Refer"
        subtitle="Refer a friend"
        bgColor="#FEF9C3"   // pastel pink
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 12,
  },
});
