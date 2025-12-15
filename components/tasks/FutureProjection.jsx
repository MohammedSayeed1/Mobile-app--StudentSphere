import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function FutureProjection({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [dilemma, setDilemma] = useState("");
  const [futureA, setFutureA] = useState("");
  const [futureB, setFutureB] = useState("");
  const [reflection, setReflection] = useState("");

  const steps = [
    {
      title: "What decision are you conflicted about?",
      prompt:
        "Write a short description of the situation you’re deciding between.",
      value: dilemma,
      setValue: setDilemma,
      placeholder: "Example: Should I switch my major or stay where I am?",
    },
    {
      title: "Project 1 Month Into the Future — Option A",
      prompt:
        "Imagine you chose Option A.\nHow would your life feel after 1 month?",
      value: futureA,
      setValue: setFutureA,
      placeholder: "Describe emotions, results, lifestyle, stress, relief…",
    },
    {
      title: "Project 1 Month Into the Future — Option B",
      prompt:
        "Now imagine you chose Option B.\nWhat would life look like after 1 month?",
      value: futureB,
      setValue: setFutureB,
      placeholder: "Describe outcomes, energy, progress, comfort…",
    },
    {
      title: "Which future feels more aligned?",
      prompt:
        "Without overthinking — which month-ahead version feels more YOU?",
      value: reflection,
      setValue: setReflection,
      placeholder: "I think I might be happier with…",
    },
  ];

  const current = steps[step];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log("🟢 FutureProjection Completed");
      console.log({ dilemma, futureA, futureB, reflection });
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
          {/* Title */}
          <Text style={styles.title}>🔮 Future Projection</Text>

          {/* CARD */}
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            style={styles.card}
            key={step}
          >
            <Text style={styles.stepTitle}>{current.title}</Text>
            <Text style={styles.prompt}>{current.prompt}</Text>

            <TextInput
              style={styles.input}
              multiline
              value={current.value}
              onChangeText={current.setValue}
              placeholder={current.placeholder}
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={[
                styles.button,
                !current.value.trim() && styles.disabled,
              ]}
              disabled={!current.value.trim()}
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

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#111",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    padding: 16,
    borderRadius: 16,
  },

  stepTitle: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "white",
    minHeight: 120,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    textAlignVertical: "top",
    color: "#000",
    marginBottom: 14,
  },

  button: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  disabled: {
    backgroundColor: "#aaa",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
