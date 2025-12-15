// components/tasks/UnsentLetter.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function UnsentLetter({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [letterBody, setLetterBody] = useState("");
  const [closing, setClosing] = useState("");

  const steps = [
    {
      title: "Unsent Letter",
      prompt:
        "This is a safe place to express anything you couldn't say out loud.\n\nWrite freely — this letter is only for you.",
      value: letterBody,
      setValue: setLetterBody,
      multiline: true,
      placeholder: "Start your letter here...",
    },
    {
      title: "Closing Line (Optional)",
      prompt:
        "If you'd like, write a final line to give yourself closure.\nYou can also skip this.",
      value: closing,
      setValue: setClosing,
      multiline: false,
      placeholder: "e.g., 'I release this and move forward.'",
    },
  ];

  const current = steps[step];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
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
            {/* TITLE */}
            <Text style={styles.title}>{current.title}</Text>

            {/* PROMPT */}
            <Text style={styles.prompt}>{current.prompt}</Text>

            {/* INPUT */}
            <TextInput
              style={[
                styles.input,
                current.multiline && { minHeight: 200 },
              ]}
              multiline={current.multiline}
              value={current.value}
              onChangeText={current.setValue}
              placeholder={current.placeholder}
              placeholderTextColor="#666"
              textAlignVertical={current.multiline ? "top" : "center"}
            />

            {/* BUTTON */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: current.value.trim() || step === 1 ? "#222" : "#999" },
              ]}
              disabled={!current.value.trim() && step !== 1}
              onPress={next}
            >
              <Text style={styles.buttonText}>
                {step === steps.length - 1 ? "Finish" : "Next →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

/* -----------------------------------------------
   🎨 STYLES
----------------------------------------------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  container: {
    padding: 20,
    paddingTop: 80,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 12,
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 18,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
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
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
