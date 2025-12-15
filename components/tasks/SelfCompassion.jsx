// components/tasks/SelfCompassion.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function SelfCompassion({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [affirmation, setAffirmation] = useState("");
  const [friendMessage, setFriendMessage] = useState("");

  const steps = [
    {
      title: "Self-Compassion Script",
      prompt:
        "Write this sentence: “I did my best with what I knew then.”\n\nNow add 1–2 sentences explaining why that’s true for you.",
      value: affirmation,
      setValue: setAffirmation,
    },
    {
      title: "If This Were a Friend…",
      prompt:
        "Imagine a friend feeling guilty about the same thing.\nWhat gentle words would you tell them?",
      value: friendMessage,
      setValue: setFriendMessage,
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
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
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.card}
            key={step}
          >
            {/* Title */}
            <Text style={styles.title}>{current.title}</Text>

            {/* Prompt */}
            <Text style={styles.prompt}>{current.prompt}</Text>

            {/* Input */}
            <TextInput
              style={styles.input}
              multiline
              placeholder="Write here..."
              placeholderTextColor="#777"
              value={current.value}
              onChangeText={current.setValue}
            />

            {/* Next button */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: current.value.trim() ? "#222" : "#999" },
              ]}
              disabled={!current.value.trim()}
              onPress={handleNext}
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

/* ---------------------------------------------------------
   🎨 Styling
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
    paddingBottom: 60,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    marginBottom: 12,
    color: "#111",
  },

  prompt: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Gilroy-Regular",
    marginBottom: 14,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#111",
    fontFamily: "Gilroy-Regular",
  },

  button: {
    marginTop: 18,
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
