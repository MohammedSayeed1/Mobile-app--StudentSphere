// components/tasks/ProblemSolveStep.jsx
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
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function ProblemSolveStep({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [problem, setProblem] = useState("");
  const [action, setAction] = useState("");
  const [commit, setCommit] = useState("");

  const steps = [
    {
      title: "1. Identify the Problem",
      prompt: "What EXACTLY is bothering you right now?",
      value: problem,
      setValue: setProblem,
    },
    {
      title: "2. Choose One Action",
      prompt: "What is ONE small step you can realistically take now?",
      value: action,
      setValue: setAction,
    },
    {
      title: "3. Commit to the Step",
      prompt: "Write a short commitment statement:",
      value: commit,
      setValue: setCommit,
    },
  ];

  const current = steps[step];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete(); // Final step
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
        style={styles.container}
      >
        <Animated.View
          entering={FadeInRight}
          exiting={FadeOutLeft}
          key={step}
          style={styles.card}
        >
          {/* TITLE */}
          <Text style={styles.title}>{current.title}</Text>

          {/* PROMPT */}
          <Text style={styles.prompt}>{current.prompt}</Text>

          {/* INPUT */}
          <TextInput
            style={styles.input}
            multiline
            placeholder="Write here..."
            placeholderTextColor="#666"
            value={current.value}
            onChangeText={current.setValue}
          />

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: current.value.trim() ? "#111a" : "#999" },
            ]}
            disabled={!current.value.trim()}
            onPress={next}
          >
            <Text style={styles.buttonText}>
              {step === steps.length - 1 ? "Finish" : "Next →"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
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

  container: { flex: 1, justifyContent: "center", padding: 20 },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    borderRadius: 16,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  prompt: {
    fontSize: 16,
    color: "#222",
    fontFamily: "Gilroy-Regular",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 12,
    minHeight: 110,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    textAlignVertical: "top",
    color: "#111",
    marginBottom: 20,
  },

  button: {
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
