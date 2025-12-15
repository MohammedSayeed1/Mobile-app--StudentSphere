// components/tasks/WorryParking.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function WorryParking({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [worry, setWorry] = useState("");
  const [intensity, setIntensity] = useState("");
  const [revisitTime, setRevisitTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const next = () => setStep((s) => s + 1);

  const steps = [
    {
      title: "🧠 Worry Parking",
      prompt: "What is the worry currently on your mind?",
      component: (
        <TextInput
          style={styles.input}
          placeholder="Write your worry here..."
          placeholderTextColor="#666"
          value={worry}
          onChangeText={setWorry}
          multiline
        />
      ),
      disabled: !worry.trim(),
    },

    {
      title: "📊 Worry Intensity",
      prompt: "How strong does this worry feel right now? (0–10)",
      component: (
        <TextInput
          style={styles.intensityInput}
          keyboardType="numeric"
          placeholder="0–10"
          placeholderTextColor="#666"
          value={intensity}
          onChangeText={setIntensity}
          maxLength={2}
        />
      ),
      disabled: !(Number(intensity) >= 0 && Number(intensity) <= 10),
    },

    {
      title: "⏳ Schedule Your Worry",
      prompt:
        "Choose a time when you will revisit this worry (and only then).",
      component: (
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.timeBtn}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.timeBtnText}>Pick a Time</Text>
          </TouchableOpacity>

          <Text style={styles.timePreview}>
            {revisitTime.toLocaleString()}
          </Text>

          {showPicker && (
            <DateTimePicker
              value={revisitTime}
              mode="time"
              display="spinner"
              onChange={(e, selected) => {
                setShowPicker(Platform.OS === "ios");
                if (selected) setRevisitTime(selected);
              }}
            />
          )}
        </View>
      ),
      disabled: false,
    },

    {
      title: "📥 Worry Saved",
      prompt:
        "Your worry is safely parked. You don’t need to engage with it until the scheduled time.",
      component: (
        <View>
          <Text style={styles.summaryText}>🧠 Worry: {worry}</Text>
          <Text style={styles.summaryText}>📊 Intensity: {intensity}/10</Text>
          <Text style={styles.summaryText}>
            ⏳ Revisit: {revisitTime.toLocaleString()}
          </Text>
        </View>
      ),
      isFinal: true,
    },
  ];

  const current = steps[step];

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <Animated.View
        entering={FadeInRight}
        exiting={FadeOutLeft}
        key={step}
        style={styles.card}
      >
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.prompt}>{current.prompt}</Text>

        {current.component}

        {/* NEXT / COMPLETE BUTTON */}
        {!current.isFinal ? (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: current.disabled ? "#aaa" : "#4F46E5" },
            ]}
            disabled={current.disabled}
            onPress={next}
          >
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#3c3d37" }]}
            onPress={onComplete}
          >
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    flex: 1,
    padding: 25,
    paddingTop: 80,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 12,
  },

  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.8)",
    minHeight: 120,
    padding: 14,
    borderRadius: 14,
    textAlignVertical: "top",
    fontFamily: "Gilroy-Regular",
    color: "#111",
    fontSize: 16,
    marginBottom: 20,
  },

  intensityInput: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 14,
    borderRadius: 14,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    fontSize: 20,
    width: 100,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  timeBtn: {
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  timeBtnText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 15,
  },

  timePreview: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },

  summaryText: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    marginVertical: 4,
  },

  button: {
    marginTop: 30,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
