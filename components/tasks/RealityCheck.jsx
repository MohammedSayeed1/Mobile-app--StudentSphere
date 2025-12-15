// components/tasks/RealityCheck.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";

import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function RealityCheck({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [worst, setWorst] = useState("");
  const [best, setBest] = useState("");
  const [likely, setLikely] = useState("");

  const steps = [
    {
      title: "Worst Case Scenario",
      prompt: "What is the absolute worst thing that could realistically happen?",
      value: worst,
      setValue: setWorst,
    },
    {
      title: "Best Case Scenario",
      prompt: "What is the best possible outcome?",
      value: best,
      setValue: setBest,
    },
    {
      title: "Most Likely Outcome",
      prompt: "Based on facts — what outcome is most realistic?",
      value: likely,
      setValue: setLikely,
    },
  ];

  const current = steps[step];

  const next = () => {
    if (step < 2) setStep(step + 1);
    else onComplete();
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
            key={step}
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.card}
          >
            <Text style={styles.title}>{current.title}</Text>

            <Text style={styles.prompt}>{current.prompt}</Text>

            <TextInput
              style={styles.input}
              multiline
              value={current.value}
              onChangeText={current.setValue}
              placeholder="Write here..."
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: current.value.trim() ? "#4F46E5" : "#888" },
              ]}
              disabled={!current.value.trim()}
              onPress={next}
            >
              <Text style={styles.buttonText}>
                {step === 2 ? "Finish" : "Next →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover"},

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    borderRadius: 18,
    minHeight: 430,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    marginBottom: 12,
    color: "#1A1A1A",
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    marginBottom: 15,
    color: "#222",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 14,
    minHeight: 130,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#333",
    marginBottom: 20,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor:"#111"
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "white",
  },
});
