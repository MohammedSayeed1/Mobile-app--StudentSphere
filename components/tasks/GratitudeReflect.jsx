import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";

export default function GratitudeReflect({ task, onComplete }) {
  const [g1, setG1] = useState("");
  const [g2, setG2] = useState("");
  const [g3, setG3] = useState("");

  const suggestions = [
    "A friend who made me smile",
    "A peaceful moment today",
    "Someone who supported me",
    "Something I accomplished",
    "A meal or drink I enjoyed",
    "A comforting message I received",
    "Good health or energy",
  ];

  const allFilled = g1.trim() && g2.trim() && g3.trim();

  const applySuggestion = (text) => {
    if (!g1.trim()) return setG1(text);
    if (!g2.trim()) return setG2(text);
    if (!g3.trim()) return setG3(text);
  };

  const handleSubmit = () => {
    console.log("🙏 Gratitude Reflection Completed");
    console.log("Items:", { g1, g2, g3 });
    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>✨ Gratitude Reflection</Text>

        <Text style={styles.description}>
          Take a moment to reflect. {"\n"}
          Write three things — big or small — that you're grateful for today.
        </Text>

        {/* INPUT BOX 1 */}
        <Text style={styles.label}>Grateful for #1</Text>
        <TextInput
          style={styles.input}
          placeholder="Something that made you smile..."
          placeholderTextColor="#999"
          value={g1}
          onChangeText={setG1}
        />

        {/* INPUT BOX 2 */}
        <Text style={styles.label}>Grateful for #2</Text>
        <TextInput
          style={styles.input}
          placeholder="Someone who helped or supported you..."
          placeholderTextColor="#999"
          value={g2}
          onChangeText={setG2}
        />

        {/* INPUT BOX 3 */}
        <Text style={styles.label}>Grateful for #3</Text>
        <TextInput
          style={styles.input}
          placeholder="A simple thing you appreciate..."
          placeholderTextColor="#999"
          value={g3}
          onChangeText={setG3}
        />

        {/* SUGGESTIONS */}
        <Text style={styles.suggestionLabel}>Need inspiration?</Text>

        {suggestions.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.suggestionCard}
            onPress={() => applySuggestion(s)}
          >
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}

        {/* COMPLETE */}
        <TouchableOpacity
          style={[styles.completeBtn, !allFilled && styles.disabledBtn]}
          disabled={!allFilled}
          onPress={handleSubmit}
        >
          <Text style={styles.completeText}>
            {allFilled ? "Mark as Completed" : "Fill all 3 to continue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingBottom: 80,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 20,
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#444",
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
    color: "#222",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    marginBottom: 14,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },

  suggestionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#333",
    marginVertical: 12,
  },

  suggestionCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  suggestionText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },

  disabledBtn: {
    backgroundColor: "rgba(60,60,60,0.4)",
  },

  completeText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
