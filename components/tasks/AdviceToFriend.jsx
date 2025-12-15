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

export default function AdviceToFriend({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [dilemma, setDilemma] = useState("");
  const [advice, setAdvice] = useState("");
  const [reflection, setReflection] = useState("");

  const steps = [
    {
      title: "What’s the dilemma?",
      prompt:
        "Briefly describe the decision or situation you're conflicted about.",
      value: dilemma,
      setValue: setDilemma,
      placeholder: "Example: Should I take this internship or focus on exams?",
    },
    {
      title: "Advice to a Friend",
      prompt: "Imagine your CLOSE friend had this same problem.\nWhat would you tell them?",
      value: advice,
      setValue: setAdvice,
      placeholder: "Write the advice you’d give to them...",
    },
    {
      title: "Now… what does this tell YOU?",
      prompt:
        "Based on the advice you wrote, what insight does this give you about your own decision?",
      value: reflection,
      setValue: setReflection,
      placeholder: "I think I actually should…",
    },
  ];

  const current = steps[step];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log("🟢 AdviceToFriend Completed");
      console.log({ dilemma, advice, reflection });
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
          <Text style={styles.title}>💬 Advice to a Friend</Text>

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
              placeholder={current.placeholder}
              placeholderTextColor="#666"
              value={current.value}
              onChangeText={current.setValue}
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
    color: "#111",
    marginTop: 20,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
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
    color: "#000",
    textAlignVertical: "top",
    marginBottom: 14,
  },

  button: {
    backgroundColor: "#4F46E5",
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
