// components/tasks/PerspectiveShift.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

export default function PerspectiveShift({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState("");
  const [friendView, setFriendView] = useState("");
  const [advice, setAdvice] = useState("");

  const steps = [
    {
      title: "Step 1 — What Happened?",
      prompt: "Briefly describe what made you feel angry.",
      value: situation,
      setter: setSituation,
    },
    {
      title: "Step 2 — Imagine a Friend",
      prompt:
        "Imagine a close friend came to you with the same situation.\n\nHow would you understand their feelings?",
      value: friendView,
      setter: setFriendView,
    },
    {
      title: "Step 3 — Perspective Shift",
      prompt:
        "Now write the advice you would give that friend —\nsomething calm, rational, and kind.",
      value: advice,
      setter: setAdvice,
    },
  ];

  const current = steps[step];

  const nextStep = () => {
    if (!current.value.trim()) return;
    if (step < 2) setStep(step + 1);
    else finishTask();
  };

  const finishTask = () => {
    Alert.alert("Saved", "Your reframe has been saved.", [
      { text: "OK", onPress: () => onComplete() },
    ]);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={{ flex: 1 }}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{task.title || "Perspective Shift"}</Text>
          <Text style={styles.description}>
            {task.description ||
              "Reframe your anger by imagining what you'd tell a friend."}
          </Text>

          <Text style={styles.stepTitle}>{current.title}</Text>
          <Text style={styles.prompt}>{current.prompt}</Text>

          <TextInput
            style={styles.input}
            value={current.value}
            onChangeText={current.setter}
            multiline
            placeholder="Write here..."
            placeholderTextColor="#777"
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: current.value.trim() ? "#4F46E5" : "#999" },
            ]}
            disabled={!current.value.trim()}
            onPress={nextStep}
          >
            <Text style={styles.buttonText}>
              {step === 2 ? "Finish" : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 18,
    borderRadius: 14,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 20,
  },

  stepTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    marginBottom: 6,
  },

  prompt: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#444",
    marginBottom: 10,
    lineHeight: 20,
  },

  input: {
    minHeight: 120,
    maxHeight: 260,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    fontSize: 15,
    color: "#111",
    marginBottom: 20,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
