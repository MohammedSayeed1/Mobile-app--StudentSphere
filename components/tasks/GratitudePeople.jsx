import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function GratitudePeople({ task, onComplete }) {
  const [person1, setPerson1] = useState("");
  const [how1, setHow1] = useState("");

  const [person2, setPerson2] = useState("");
  const [how2, setHow2] = useState("");

  const isComplete = person1.trim() !== "" && person2.trim() !== "";

  const handleSubmit = () => {
    console.log("🙏 GratitudePeople → Task Completed");
    

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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.title}>🙏 Gratitude for the People Who Helped You</Text>

          <Text style={styles.description}>
            Take a moment to remember two people who have supported you recently.
            Even small acts of kindness matter.
          </Text>

          {/* PERSON 1 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Person 1</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter their name"
              placeholderTextColor="#777"
              value={person1}
              onChangeText={setPerson1}
            />

            <Text style={styles.subLabel}>How did they help you? (optional)</Text>

            <TextInput
              style={styles.smallInput}
              placeholder="Ex: They encouraged me yesterday"
              placeholderTextColor="#999"
              value={how1}
              onChangeText={setHow1}
              multiline
            />
          </View>

          {/* PERSON 2 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Person 2</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter their name"
              placeholderTextColor="#777"
              value={person2}
              onChangeText={setPerson2}
            />

            <Text style={styles.subLabel}>How did they help you? (optional)</Text>

            <TextInput
              style={styles.smallInput}
              placeholder="Ex: They shared their notes"
              placeholderTextColor="#999"
              value={how2}
              onChangeText={setHow2}
              multiline
            />
          </View>

          {/* COMPLETE BUTTON */}
          <TouchableOpacity
            style={[styles.completeBtn, !isComplete && styles.disabledBtn]}
            disabled={!isComplete}
            onPress={handleSubmit}
          >
            <Text style={styles.completeText}>
              {isComplete ? "Mark as Completed" : "Enter Both Names to Continue"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  bgImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },

  // TEXT
  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 20,
    textAlign:"center"
  },
  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 20,
    textAlign:"justify"
  },

  // CARD BOX
  card: {
    padding: 10,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    // marginBottom: 8,
    padding:10
  },

  label: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 6,
  },

  subLabel: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#444",
    marginTop: 10,
    marginBottom: 6,
  },

  // INPUTS
  input: {
    backgroundColor: "rgba(255,255,255,1)",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    elevation: 1,
    margin:5
  },

  smallInput: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    minHeight: 70,
    marginTop: 6,
    textAlignVertical: "top",
    elevation: 1,
    margin:5
  },

  // BUTTON
  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 15,
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
