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

export default function FutureSelfLetter({ task, onComplete }) {
  const [letter, setLetter] = useState("");

  const prompts = [
    "I am stronger than I feel right now.",
    "This moment will pass — I am not alone.",
    "It's okay to feel this way.",
    "I am doing the best I can.",
    "I deserve patience and kindness.",
  ];

  const canComplete = letter.trim().length > 10;

  const handleComplete = () => {
    console.log("📘 Future Self Letter:", letter);
    onComplete();
  };

  const addPrompt = (text) => {
    setLetter((prev) => (prev ? prev + " " + text : text));
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      {/* Soft overlay */}
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title */}
        <Text style={styles.title}>💙 Write to Future Self</Text>

        <Text style={styles.description}>
          Imagine your future self going through a hard moment.  
          What comforting words would you offer them?
        </Text>

        {/* Suggestion Chips */}
        <View style={styles.promptWrapper}>
          {prompts.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={styles.promptChip}
              onPress={() => addPrompt(p)}
            >
              <Text style={styles.promptText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Writing Box */}
        <TextInput
          style={styles.input}
          placeholder="Write your message here..."
          placeholderTextColor="#777"
          value={letter}
          onChangeText={setLetter}
          multiline
        />

        {/* Complete Button */}
        <TouchableOpacity
          style={[styles.completeBtn, !canComplete && styles.disabledBtn]}
          disabled={!canComplete}
          onPress={handleComplete}
        >
          <Text style={styles.completeText}>
            {canComplete ? "Mark as Completed" : "Write a few comforting words"}
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
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  container: {
    padding: 20,
    paddingBottom: 70,
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
    color: "#333",
    marginBottom: 20,
  },

  promptWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  promptChip: {
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },

  promptText: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 14,
    minHeight: 140,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#111",
    marginBottom: 20,
    fontFamily: "Gilroy-Regular",
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
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
