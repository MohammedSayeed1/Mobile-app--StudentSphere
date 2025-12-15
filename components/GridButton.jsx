import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function GridButton({
  title,
  subtitle,
  bgColor,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },

  title: {
    fontSize: 17,
    fontFamily:"Gilroy-Bold",
    color: "#0C1842",

  },

  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 6,
    fontFamily:"Gilroy-Bold"
  },
});
