import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
} from "react-native";

import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function FutureSelfNote({ task, onComplete }) {
  const [note, setNote] = useState("");

  const handleFinish = () => {
    console.log("📝 Future Self Note Saved:", note);
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
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.card}
          >
            <Text style={styles.title}>💌 Future-Self Note</Text>

            <Text style={styles.description}>
              Imagine yourself 1 month in the future.  
              What would you want to remind or encourage your future self about?
            </Text>

            <Text style={styles.prompt}>
              ✨ Write a short note to your future self:
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Dear future me..."
              placeholderTextColor="#666"
              value={note}
              onChangeText={setNote}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: note.trim() ? "#111" : "#999" },
              ]}
              disabled={!note.trim()}
              onPress={handleFinish}
            >
              <Text style={styles.buttonText}>Save Note</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingTop: 40,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    borderRadius: 16,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    marginBottom: 10,
    color: "#111",
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#222",
    marginBottom: 20,
    lineHeight: 22,
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  input: {
    minHeight: 140,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    textAlignVertical: "top",
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
