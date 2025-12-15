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

export default function MicroGratitude({ task, onComplete }) {
  const [gratitude, setGratitude] = useState("");

  const suggestions = [
    "A moment of peace",
    "Someone who was kind",
    
    "Finishing something important",
    "Good food today",
  ];

  const handleComplete = () => {
    console.log("🙏 One Small Gratitude Submitted:", gratitude);
    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title */}
        <Text style={styles.title}>🌱 One Small Gratitude</Text>

        <Text style={styles.description}>
          Think of one thing — even a tiny moment — that you appreciated today.
        </Text>

        {/* Suggestions */}
        <View style={styles.suggestionsWrapper}>
          {suggestions.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestionChip}
              onPress={() => setGratitude(item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Write one thing you’re grateful for..."
          placeholderTextColor="#777"
          value={gratitude}
          onChangeText={setGratitude}
          multiline
        />

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeBtn,
            gratitude.trim().length === 0 && styles.disabledBtn,
          ]}
          disabled={gratitude.trim().length === 0}
          onPress={handleComplete}
        >
          <Text style={styles.completeText}>
            {gratitude.trim().length === 0 ? "Write something…" : "Mark as Completed"}
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
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  container: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    marginBottom: 20,
    color: "#333",
    opacity: 0.9,
  },

  suggestionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 10,
  },

  suggestionChip: {
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },

  suggestionText: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 14,
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    marginBottom: 20,
    color: "#111",
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  disabledBtn: {
    backgroundColor: "rgba(60,60,60,0.3)",
  },

  completeText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
