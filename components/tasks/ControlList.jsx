// components/tasks/ControlList.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";

export default function ControlList({ task, onComplete }) {
  const [inControl, setInControl] = useState("");
  const [notInControl, setNotInControl] = useState("");
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Step 1: What Can You Control?",
      prompt:
        "List things you CAN influence right now.\n(Your actions, thoughts, small choices)",
      value: inControl,
      setValue: setInControl,
    },
    {
      title: "Step 2: What Is NOT in Your Control?",
      prompt:
        "List things you CANNOT directly change.\n(Circumstances, other people, outcomes)",
      value: notInControl,
      setValue: setNotInControl,
    },
    {
      title: "Reflection",
      prompt:
        "Great work! Notice how much lighter things feel.\nYou now know where to focus your energy.",
    },
  ];

  const next = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const current = steps[step];

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.prompt}>{current.prompt}</Text>

          {step < 2 && (
            <TextInput
              style={styles.input}
              multiline
              placeholder="Write here..."
              placeholderTextColor="#666"
              value={current.value}
              onChangeText={current.setValue}
            />
          )}

          <TouchableOpacity
            onPress={next}
            style={[
              styles.button,
              step < 2 && !current.value.trim() && styles.disabledButton,
            ]}
            disabled={step < 2 && !current.value.trim()}
          >
            <Text style={styles.buttonText}>
              {step === 2 ? "Finish" : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    marginBottom: 10,
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 16,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 14,
    color: "#111",
    fontFamily: "Gilroy-Regular",
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: "#999",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
