import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Linking,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";

export default function GratitudeLetter({ task, onComplete }) {
  // -------------------------------
  // OPTIONS
  // -------------------------------
  const recipients = [
    "A friend",
    "A family member",
    "A teacher",
    "A mentor",
    "Someone who supported me",
    "Someone who inspired me",
  ];

  const suggestions = [
    "Thank you for being there when I needed help.",
    "Your kindness meant more to me than you realize.",
    "I appreciate your support — it made a big difference.",
    "Thank you for inspiring me. It truly helped.",
    "Your presence brings comfort. I'm grateful for you.",
  ];

  // -------------------------------
  // STATE
  // -------------------------------
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [message, setMessage] = useState("");
  const [actionTaken, setActionTaken] = useState(false);

  // -------------------------------
  // ACTIONS: WhatsApp / SMS / Copy / Save
  // -------------------------------
  const sendWhatsApp = async () => {
    if (!validateMessage()) return;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
      setActionTaken(true);
    } else {
      Alert.alert("WhatsApp Not Installed", "Please install WhatsApp to continue.");
    }
  };

  const sendSMS = () => {
    if (!validateMessage()) return;

    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`);
    setActionTaken(true);
  };

  const copyText = async () => {
    if (!validateMessage()) return;

    await Clipboard.setStringAsync(message);
    Alert.alert("Copied!", "Your gratitude letter has been copied.");
    setActionTaken(true);
  };

  const saveOnly = () => {
    if (!validateMessage()) return;

    Alert.alert("Saved", "Your message has been saved privately.");
    setActionTaken(true);
  };

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validateMessage = () => {
    if (!selectedRecipient) {
      Alert.alert("Choose Recipient", "Please choose who this letter is for.");
      return false;
    }
    if (message.trim().length < 10) {
      Alert.alert("Message too short", "Please write at least one meaningful sentence.");
      return false;
    }
    return true;
  };

  const canComplete = validateComplete();

  function validateComplete() {
    return (
      selectedRecipient &&
      message.trim().length >= 10 &&
      actionTaken
    );
  }

  const handleSubmit = () => {
    console.log("💌 Gratitude Letter Completed");
    console.log("Recipient:", selectedRecipient);
    console.log("Message:", message);

    onComplete();
  };

  // -------------------------------
  // COMPONENT UI
  // -------------------------------
  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>💌 Write a Gratitude Letter</Text>

        <Text style={styles.description}>
          Gratitude helps strengthen your emotional bonds and lifts your mood.{"\n"}
          Write a short thank-you message to someone who has made a difference in your life.
        </Text>

        {/* SELECT RECIPIENT */}
        <Text style={styles.sectionLabel}>Who is this letter for?</Text>

        {recipients.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.card,
              selectedRecipient === r && styles.cardSelected,
            ]}
            onPress={() => setSelectedRecipient(r)}
          >
            <Text
              style={[
                styles.cardText,
                selectedRecipient === r && styles.cardTextSelected,
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}

        {/* SUGGESTION TEMPLATES */}
        <Text style={styles.sectionLabel}>Use a suggestion (optional):</Text>

        {suggestions.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.suggestionCard}
            onPress={() => setMessage(s)}
          >
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}

        {/* MESSAGE INPUT */}
        <Text style={styles.sectionLabel}>Your Gratitude Letter:</Text>

        <TextInput
          style={styles.input}
          placeholder="Write your message here..."
          placeholderTextColor="#aaa"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* SEND OPTIONS */}
        <Text style={styles.sectionLabel}>Send or Save:</Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.shareBtn} onPress={sendWhatsApp}>
            <Text style={styles.shareText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={sendSMS}>
            <Text style={styles.shareText}>SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={copyText}>
            <Text style={styles.shareText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={saveOnly}>
            <Text style={styles.shareText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* COMPLETION BUTTON */}
        <TouchableOpacity
          style={[styles.completeBtn, !canComplete && styles.disabledBtn]}
          disabled={!canComplete}
          onPress={handleSubmit}
        >
          <Text style={styles.completeText}>
            {canComplete
              ? "Mark as Completed"
              : "Complete an action to continue"}
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
    color: "#111",
    marginBottom: 20,
    opacity: 0.9,
  },

  sectionLabel: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginTop: 16,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  cardSelected: {
    backgroundColor: "white",
    borderColor: "#3c3d37",
    borderWidth: 2,
  },
  cardText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },
  cardTextSelected: {
    color: "#3c3d37",
    fontFamily: "Gilroy-Bold",
  },

  suggestionCard: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestionText: {
    color: "#111",
    fontFamily: "Gilroy-Regular",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  shareBtn: {
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  shareText: {
    color: "#111",
    fontFamily: "Gilroy-Bold",
  },

  completeBtn: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  completeText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
