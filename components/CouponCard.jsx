// CouponCard.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CouponCard({ reward, unlocked }) {
  return (
    <View style={[styles.card, !unlocked && styles.locked]}>
      <View>
        <Text style={styles.title}>{reward.title}</Text>
        <Text style={styles.subtitle}>{reward.subtitle}</Text>

        {!unlocked && (
          <Text style={styles.lockText}>
            Unlocks at Level {reward.minLevel}
          </Text>
        )}
      </View>

      <TouchableOpacity
        disabled={!unlocked}
        style={[styles.btn, unlocked ? styles.active : styles.disabled]}
      >
        <Text style={styles.btnText}>
          {unlocked ? "Open" : "Locked"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  locked: {
    opacity: 0.45,
  },
  title: {
    fontWeight: "800",
    fontSize: 15,
  },
  subtitle: {
    color: "#555",
    marginTop: 2,
  },
  lockText: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  btn: {
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  active: {
    backgroundColor: "#5C6CFF",
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
