import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";

export default function PayItForward({ task, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [reflection, setReflection] = useState("");

  const actions = [
    "Give a genuine compliment",
    "Hold the door for someone",
    "Help someone carry something",
    "Share notes or resources",
    "Let someone go first in line",
    "Send a supportive message",
    "Smile warmly at someone",
    "Offer help to a classmate",
    "Leave an uplifting note",
  ];

  const handleSubmit = () => {
    console.log("💛 Pay It Forward → Completed");
    console.log("Selected:", selected);
    console.log("Reflection:", reflection);

    onComplete();
  };

  const canComplete = selected !== null;

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>💛 Pay It Forward</Text>

        <Text style={styles.description}>
          Choose one small act of kindness and do it today.{"\n"}
          Even a tiny gesture can create a ripple of positivity.
        </Text>

        {/* KIND ACT OPTIONS */}
        <Text style={styles.sectionLabel}>Choose an act:</Text>

        {actions.map((act, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.card,
              selected === act && styles.cardSelected
            ]}
            onPress={() => setSelected(act)}
          >
            <Text
              style={[
                styles.cardText,
                selected === act && styles.cardTextSelected
              ]}
            >
              {act}
            </Text>
          </TouchableOpacity>
        ))}

        {/* REFLECTION OPTIONAL */}
        <Text style={styles.sectionLabel}>Reflection (optional):</Text>

        <TextInput
          style={styles.input}
          placeholder="How did it feel? Why did you choose this act?"
          placeholderTextColor="#aaa"
          multiline
          value={reflection}
          onChangeText={setReflection}
        />

        {/* COMPLETE BUTTON */}
        <TouchableOpacity
          style={[styles.completeBtn, !canComplete && styles.disabledBtn]}
          disabled={!canComplete}
          onPress={handleSubmit}
        >
          <Text style={styles.completeText}>
            {canComplete ? "Mark as Completed" : "Choose an act to continue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 80,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 20,
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 12,
    marginTop: 10,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  cardSelected: {
    backgroundColor: "#fff",
    borderColor: "#3c3d37",
    borderWidth: 2,
  },
  cardText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },
  cardTextSelected: {
    fontFamily: "Gilroy-Bold",
    color: "#3c3d37",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    minHeight: 100,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    textAlignVertical: "top",
    marginBottom: 20,
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: "rgba(60,60,60,0.4)",
  },

  completeText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
