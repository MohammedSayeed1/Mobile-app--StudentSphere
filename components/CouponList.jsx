// CouponsList.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CouponCard from "./CouponCard";

export default function CouponsList({ rewards = [], currentLevel }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <Text style={styles.heading}>Discounts & Offers</Text>

      {rewards.length === 0 ? (
        <Text style={styles.empty}>No rewards available</Text>
      ) : (
        rewards.map((r) => (
          <CouponCard
            key={r.code}
            reward={r}
            unlocked={currentLevel >= r.minLevel}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "800",
    marginVertical: 12,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
});
