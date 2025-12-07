import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function SpreadKindness({ task, onComplete }) {
  const [selected, setSelected] = useState(null);

  const ideas = [
    "Send a genuine compliment to someone",
    "Hold the door open or help someone nearby",
    "Write a kind message to a friend or family member",
    "Share something helpful (notes/resources)",
    "Say thank you to someone who deserves it",
    "Do a small act of service (like filling someone's bottle)",
  ];

  const handleComplete = () => {
    console.log("🔥 SpreadKindness → calling parent onComplete()");
    console.log("📌 Selected idea index:", selected);
    onComplete();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌼 Spread Kindness</Text>

      <Text style={styles.description}>
        Performing small acts of kindness boosts happiness, strengthens social
        connections, and increases emotional well-being.
      </Text>

      <Text style={styles.sectionLabel}>Choose One:</Text>

      {ideas.map((idea, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.ideaCard, selected === idx && styles.ideaSelected]}
          onPress={() => setSelected(idx)}
        >
          <Text style={styles.ideaText}>{idea}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.completeBtn, selected == null && styles.disabledBtn]}
        disabled={selected == null}
        onPress={handleComplete}
      >
        <Text style={styles.completeText}>Mark as Completed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fafaf5", flex: 1 },

  title: { fontSize: 26, fontFamily: "Gilroy-Bold", marginBottom: 10 },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    marginBottom: 20,
    color: "#555",
  },

  sectionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginBottom: 12,
  },

  ideaCard: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
  },

  ideaSelected: {
    borderColor: "#3c3d37",
    borderWidth: 2,
  },

  ideaText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  disabledBtn: {
    backgroundColor: "#b3b3b3",
  },

  completeText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
