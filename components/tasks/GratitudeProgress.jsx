import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import Animated, {
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

export default function GratitudeProgress({ task, onComplete }) {
  const [change1, setChange1] = useState("");
  const [change2, setChange2] = useState("");

  const canSubmit = change1.trim() && change2.trim();

  const handleSubmit = () => {
    console.log("🌼 Gratitude for Progress:", { change1, change2 });
    onComplete();
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
          >
            <Text style={styles.title}>🌼 Gratitude for Progress</Text>

            <Text style={styles.description}>
              Gratitude grows when you notice your own improvements. {"\n"}{"\n"}
              Write <Text style={{ fontFamily: "Gilroy-Bold" }}>two small changes</Text>  
              you are genuinely proud of — no matter how tiny.
            </Text>

            {/* Change 1 Input */}
            <TextInput
              style={styles.input}
              placeholder="1. Something you did better than before..."
              placeholderTextColor="#666"
              value={change1}
              onChangeText={setChange1}
              multiline
            />

            {/* Change 2 Input */}
            <TextInput
              style={styles.input}
              placeholder="2. Another small improvement..."
              placeholderTextColor="#666"
              value={change2}
              onChangeText={setChange2}
              multiline
            />

            <TouchableOpacity
              style={[styles.button, !canSubmit && styles.disabledButton]}
              disabled={!canSubmit}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                Save Gratitude
              </Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

/* ------------------------------------------------------
   🎨 STYLES
------------------------------------------------------ */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingTop: 50,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.66)",
    padding: 20,
    borderRadius: 16,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#222",
    marginBottom: 20,
    lineHeight: 22,
  },

  input: {
    minHeight: 70,
    backgroundColor: "rgba(245,245,245)",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    textAlignVertical: "top",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: "#9ca3af",
  },

  buttonText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
