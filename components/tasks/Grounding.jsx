// components/tasks/grounding/Anx54321.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function Anx54321({ task, onComplete }) {
  const steps = [
    { count: 5, label: "things you can see" },
    { count: 4, label: "things you can touch" },
    { count: 3, label: "things you can hear" },
    { count: 2, label: "things you can smell" },
    { count: 1, label: "thing you can taste" },
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");

  const goNext = () => {
    if (stepIndex < steps.length - 1) {
      setInput("");
      setStepIndex(stepIndex + 1);
    } else {
      onComplete(); // return to tasks page
    }
  };

  const step = steps[stepIndex];

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.card}>
          <Text style={styles.stepTitle}>
            {step.count} {step.label}
          </Text>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Write here..."
            placeholderTextColor="#888"
            multiline
            style={styles.input}
          />

          <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
            <Text style={styles.nextText}>
              {stepIndex === steps.length - 1 ? "Finish" : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    color: "#222",
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
  },

  description: {
    fontSize: 16,
    color: "#444",
    fontFamily: "Gilroy-Regular",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },

  stepTitle: {
    fontSize: 20,
    color: "#222",
    fontFamily: "Gilroy-Bold",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    height: 120,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#222",
  },

  nextBtn: {
    marginTop: 20,
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  nextText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
