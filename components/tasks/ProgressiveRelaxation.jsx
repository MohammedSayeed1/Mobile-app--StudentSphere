import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function ProgressiveRelaxation({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Relax Your Forehead",
      instruction:
        "Soften your forehead. Release any tightness around your temples.",
    },
    {
      title: "Relax Eyes & Jaw",
      instruction:
        "Unclench your jaw. Let your eyes rest gently in their sockets.",
    },
    {
      title: "Drop Your Shoulders",
      instruction:
        "Lower your shoulders away from your ears. Let them grow heavy.",
    },
    {
      title: "Relax Arms & Hands",
      instruction:
        "Let your arms rest naturally. Release any tension in your fingers.",
    },
    {
      title: "Chest & Breathing",
      instruction:
        "Take a slow deep breath. Let your chest soften as you exhale.",
    },
    {
      title: "Legs & Feet",
      instruction:
        "Allow your legs to grow heavy. Release tension all the way to your toes.",
    },
  ];

  const next = () => {
    if (step < steps.length - 1) {
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
        <Animated.View
          key={step}
          entering={FadeInRight}
          exiting={FadeOutLeft}
          style={styles.card}
        >
          <Text style={styles.title}>🌿 Progressive Relaxation</Text>

          <Text style={styles.stepTitle}>{current.title}</Text>
          <Text style={styles.instruction}>{current.instruction}</Text>

          <TouchableOpacity style={styles.button} onPress={next}>
            <Text style={styles.buttonText}>
              {step === steps.length - 1 ? "Finish" : "Next →"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
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
    flexGrow: 1,
    padding: 20,
    paddingTop: 80,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    borderRadius: 18,
    minHeight: 300,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 15,
  },

  stepTitle: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    marginBottom: 12,
    color: "#222",
  },

  instruction: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#444",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#3c3d37",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
