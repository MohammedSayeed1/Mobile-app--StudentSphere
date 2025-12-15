import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function ProgressLog({ task, onComplete }) {
  const [win, setWin] = useState("");

  const handleSubmit = () => {
    console.log("🌱 Progress Log Saved:", win);
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
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.card}
          >
            {/* Title */}
            <Text style={styles.title}>🌱 Progress Log</Text>

            <Text style={styles.description}>
              Hope grows when you notice small wins.{"\n"}
              Write one recent thing you did that shows you're growing or trying.
            </Text>

            {/* Input Field */}
            <TextInput
              style={styles.input}
              placeholder="Example: I showed up even though I felt low."
              placeholderTextColor="#666"
              value={win}
              onChangeText={setWin}
              multiline
            />

            {/* Complete Button */}
            <TouchableOpacity
              style={[
                styles.button,
                win.trim().length === 0 && styles.disabledButton,
              ]}
              disabled={win.trim().length === 0}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Save Progress</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

/* ------------------------------------------------------
   STYLES
------------------------------------------------------ */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingTop: 50,
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
    color: "#222",
    fontFamily: "Gilroy-Regular",
    marginBottom: 20,
    lineHeight: 22,
  },

  input: {
    minHeight: 100,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#222",
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#9ca3af",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
