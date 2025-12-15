import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function SmallGoalStep({ task, onComplete }) {
  const [goal, setGoal] = useState("");
  const [step, setStep] = useState("");

  const handleFinish = () => {
    console.log("🎯 Small Goal:", goal);
    console.log("🪜 First Step:", step);
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
            <Text style={styles.title}>🎯 Small Goal Step</Text>

            <Text style={styles.description}>
              Every big dream grows from a tiny step.  
              Let's identify one small action you can take today toward something you hope for.
            </Text>

            {/* GOAL INPUT */}
            <Text style={styles.label}>✨ What do you hope to achieve?</Text>

            <TextInput
              style={styles.input}
              placeholder="Example: Improve my grades / Become healthier / Build confidence..."
              placeholderTextColor="#666"
              value={goal}
              onChangeText={setGoal}
              multiline
            />

            {/* STEP INPUT */}
            <Text style={[styles.label, { marginTop: 20 }]}>
              🪜 What is ONE small step you can take today?
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Example: Study 10 minutes, drink water, send one email..."
              placeholderTextColor="#666"
              value={step}
              onChangeText={setStep}
              multiline
            />

            {/* COMPLETE BUTTON */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: step.trim() ? "#4F46E5" : "#999" },
              ]}
              disabled={!step.trim()}
              onPress={handleFinish}
            >
              <Text style={styles.buttonText}>Mark as Completed</Text>
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
    color: "#111",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: "#222",
    fontFamily: "Gilroy-Regular",
    marginBottom: 20,
    lineHeight: 22,
  },

  label: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "rgba(245,245,245)",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    minHeight: 70,
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
