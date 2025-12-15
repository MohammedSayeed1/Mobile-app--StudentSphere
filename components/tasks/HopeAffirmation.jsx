import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function HopeAffirmation({ task, onComplete }) {
  const [text, setText] = useState("I am moving toward ");

  const handleFinish = () => {
    console.log("✨ Hopeful Affirmation Saved:", text);
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
            {/* HEADER */}
            <Text style={styles.title}>🌟 Hopeful Affirmation</Text>

            <Text style={styles.description}>
              Write a short affirmation that begins with{" "}
              <Text style={styles.bold}>"I am moving toward…"</Text>
              {"\n"}Let this be a gentle promise to your future self.
            </Text>

            {/* TEXT INPUT */}
            <TextInput
              style={styles.input}
              multiline
              value={text}
              placeholder="I am moving toward my goals with patience..."
              placeholderTextColor="#666"
              onChangeText={setText}
            />

            {/* COMPLETE BUTTON */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: text.trim().length > 0 ? "#222" : "#9ca3af" },
              ]}
              disabled={text.trim().length === 0}
              onPress={handleFinish}
            >
              <Text style={styles.buttonText}>Save Affirmation</Text>
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
    backgroundColor: "rgba(255,255,255,0.3)",
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
    color: "#111",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    marginBottom: 20,
    fontFamily: "Gilroy-Regular",
  },

  bold: {
    fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 14,
    borderRadius: 12,
    minHeight: 100,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    textAlignVertical: "top",
  },

  button: {
    marginTop: 25,
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
