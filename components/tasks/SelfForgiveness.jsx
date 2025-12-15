// components/tasks/SelfForgiveness.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";

export default function SelfForgiveness({ task, onComplete }) {
  const [sentence, setSentence] = useState("");

  const handleSubmit = () => {
    console.log("🕊 Self-Forgiveness Saved:", sentence);
    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>🕊 Self-Forgiveness</Text>

            <Text style={styles.prompt}>
              Think of a sentence you would accept from someone who cares about you.
              {"\n\n"}
              Now write that same kindness to yourself.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g., 'I forgive you. You were trying your best.'"
              placeholderTextColor="#666"
              multiline
              value={sentence}
              onChangeText={setSentence}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: sentence.trim() ? "#222" : "#999" },
              ]}
              disabled={!sentence.trim()}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

/* ---------------------------------------------------------
   🎨 STYLES
--------------------------------------------------------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingTop: 80,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 20,
    borderRadius: 16,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 14,
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#222",
    marginBottom: 20,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    minHeight: 120,
    fontFamily: "Gilroy-Regular",
    fontSize: 15,
    color: "#111",
  },

  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
