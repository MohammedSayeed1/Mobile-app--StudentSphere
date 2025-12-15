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

export default function ListWorriesBenefits({ task, onComplete }) {
  const [worries, setWorries] = useState("");
  const [benefits, setBenefits] = useState("");

  const handleSubmit = () => {
    console.log("⚖️ Worries vs Benefits Completed");
    console.log({ worries, benefits });
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Title */}
          <Text style={styles.title}>⚖️ Worries vs Benefits</Text>

          <Text style={styles.description}>
            Let’s separate **fears** from **actual benefits** to bring clarity.
            Write freely in each section.
          </Text>

          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            style={styles.card}
          >
            {/* Worries Section */}
            <Text style={styles.sectionLabel}>What are you worried about?</Text>

            <TextInput
              style={styles.input}
              multiline
              placeholder="Write your fears, doubts, emotional blocks..."
              placeholderTextColor="#666"
              value={worries}
              onChangeText={setWorries}
            />

            {/* Benefits Section */}
            <Text style={styles.sectionLabel}>What are the benefits?</Text>

            <TextInput
              style={styles.input}
              multiline
              placeholder="Write the possible positives, growth, opportunities..."
              placeholderTextColor="#666"
              value={benefits}
              onChangeText={setBenefits}
            />

            <TouchableOpacity
              style={[
                styles.button,
                !(worries.trim() && benefits.trim()) && styles.disabled,
              ]}
              disabled={!(worries.trim() && benefits.trim())}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Finish</Text>
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
  container: { padding: 20, paddingBottom: 50 },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 12,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#222",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    padding: 16,
    borderRadius: 16,
  },

  sectionLabel: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
    marginBottom: 8,
    color: "#111",
  },

  input: {
    backgroundColor: "white",
    minHeight: 110,
    borderRadius: 14,
    padding: 12,
    fontSize: 15,
    color: "#000",
    fontFamily: "Gilroy-Regular",
    textAlignVertical: "top",
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  disabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },
});
