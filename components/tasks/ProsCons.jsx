import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function ProsCons({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [decision, setDecision] = useState("");
  const [pros, setPros] = useState(["", "", ""]);
  const [cons, setCons] = useState(["", "", ""]);

  const steps = [
    {
      title: "What decision are you thinking about?",
      placeholder: "e.g., Should I change my major?",
      value: decision,
      setter: setDecision,
    },
    {
      title: "List 3 Pros",
      isList: true,
      list: pros,
      setter: setPros,
    },
    {
      title: "List 3 Cons",
      isList: true,
      list: cons,
      setter: setCons,
    },
  ];

  const current = steps[step];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete(); // finish
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.card}
            key={step}
          >
            {/* Title */}
            <Text style={styles.title}>{task?.title || "Pros & Cons"}</Text>

            {/* Prompt */}
            <Text style={styles.subtitle}>{current.title}</Text>

            {/* Step: Decision Name */}
            {!current.isList && (
              <TextInput
                style={styles.input}
                value={current.value}
                onChangeText={current.setter}
                placeholder={current.placeholder}
                placeholderTextColor="#666"
              />
            )}

            {/* Step: Pros / Cons List */}
            {current.isList && (
              <View style={{ marginTop: 10 }}>
                {current.list.map((item, i) => (
                  <TextInput
                    key={i}
                    style={styles.input}
                    value={item}
                    onChangeText={(t) => {
                      const copy = [...current.list];
                      copy[i] = t;
                      current.setter(copy);
                    }}
                    placeholder={`➤ Point ${i + 1}`}
                    placeholderTextColor="#666"
                  />
                ))}
              </View>
            )}

            {/* Next Button */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    (!current.isList && !current.value.trim()) ||
                    (current.isList &&
                      current.list.some((x) => !x.trim()))
                      ? "#999"
                      : "#222",
                },
              ]}
              disabled={
                (!current.isList && !current.value.trim()) ||
                (current.isList && current.list.some((x) => !x.trim()))
              }
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
  },

  container: {
    padding: 20,
    paddingBottom: 60,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    borderRadius: 16,
    marginTop: 40,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },

  button: {
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
