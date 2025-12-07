import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

export default function CelebrateWin({ task, onComplete }) {
  const [wins, setWins] = useState(["", "", ""]);

  const handleChange = (text, index) => {
    const updated = [...wins];
    updated[index] = text;
    setWins(updated);
  };

  const allFilled = wins.every((w) => w.trim().length > 0);

  const handleComplete = () => {
    console.log("🔥 CelebrateWin → calling parent onComplete()");
    console.log("📌 Wins data:", wins);
    onComplete(); // <-- TRIGGER PARENT'S markComplete()
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎉 Celebrate a Win</Text>

      <Text style={styles.description}>
        Reflecting on positive events strengthens emotional resilience and helps your brain
        store uplifting memories more deeply. Write three things that went well today.
      </Text>

      {wins.map((w, i) => (
        <View key={i} style={styles.inputWrapper}>
          <Text style={styles.label}>Win {i + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            value={w}
            onChangeText={(text) => handleChange(text, i)}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.completeBtn, !allFilled && styles.disabledBtn]}
        disabled={!allFilled}
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

  inputWrapper: {
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    elevation: 2,
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
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
