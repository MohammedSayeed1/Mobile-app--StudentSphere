// components/tasks/RepairChecklist.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function RepairChecklist({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [situation, setSituation] = useState("");
  const [repairAction, setRepairAction] = useState("");

  const steps = [
    {
      title: "What Happened?",
      prompt:
        "Briefly describe what happened that led to feeling guilty.\nThis helps you understand the situation clearly.",
      value: situation,
      setValue: setSituation,
    },
    {
      title: "Repair Checklist",
      prompt:
        "What is ONE small action you can take to repair, improve, or move forward from this situation?",
      value: repairAction,
      setValue: setRepairAction,
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
            {/* Title */}
            <Text style={styles.title}>{current.title}</Text>

            {/* Prompt */}
            <Text style={styles.prompt}>{current.prompt}</Text>

            {/* Input */}
            <TextInput
              style={styles.input}
              multiline
              value={current.value}
              onChangeText={current.setValue}
              placeholder="Write here..."
              placeholderTextColor="#666"
            />

            {/* Next Button */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: current.value.trim() ? "#222" : "#999" },
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

/* -----------------------------------------------
   🎨 STYLES
----------------------------------------------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: { padding: 20, paddingTop: 80 },

  card: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 14,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    textAlignVertical: "top",
    fontFamily: "Gilroy-Regular",
    fontSize: 15,
    color: "#111",
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
