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

export default function ReachOut({ task, onComplete }) {
  const [message, setMessage] = useState("");

  const suggestions = [
    "Thinking of you today 💛",
    "Just wanted to check in — hope you're okay.",
    "You crossed my mind today. Sending warm thoughts.",
    "If you ever need to talk, I'm here for you.",
    "Hope you’re taking care of yourself 💙",
  ];

  const handleSelect = (text) => {
    setMessage(text);
  };

  // ---------------------------
  // SEND TO WHATSAPP
  // ---------------------------
  const sendToWhatsApp = async () => {
    if (!message.trim()) {
      return Alert.alert(
        "Message Empty",
        "Please choose or type a message first."
      );
    }

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp Not Installed", "Please install WhatsApp.");
    }
  };

  // ---------------------------
  // SEND TO SMS
  // ---------------------------
  const sendToSMS = () => {
    if (!message.trim()) {
      return Alert.alert(
        "Message Empty",
        "Please choose or type a message first."
      );
    }

    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`);
  };

  // ---------------------------
  // COPY TO CLIPBOARD
  // ---------------------------
  const copyToClipboard = async () => {
    if (!message.trim()) {
      return Alert.alert(
        "Message Empty",
        "Please choose or type a message first."
      );
    }

    await Clipboard.setStringAsync(message);
    Alert.alert("Copied!", "Message copied to clipboard.");
  };

  const handleSubmit = () => {
    console.log("💌 ReachOut → calling parent onComplete()");
    console.log("📨 Message sent:", message);
    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")} // local background
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>💌 Reach Out</Text>

        <Text style={styles.description}>
          Sometimes a small message can make a big difference. {"\n"}
          Send a gentle “Thinking of you” message to someone you care about.
        </Text>

        <Text style={styles.sectionLabel}>Choose a message:</Text>

        {suggestions.map((txt, i) => (
          <TouchableOpacity
            key={i}
            style={styles.suggestionCard}
            onPress={() => handleSelect(txt)}
          >
            <Text style={styles.suggestionText}>{txt}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Or write your own:</Text>

        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#ccc"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* SHARE VIA OPTIONS */}
        <Text style={styles.shareLabel}>Send via:</Text>

        <View style={styles.shareRow}>
          <TouchableOpacity style={styles.shareBtn} onPress={sendToWhatsApp}>
            <Text style={styles.shareText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={sendToSMS}>
            <Text style={styles.shareText}>SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={copyToClipboard}>
            <Text style={styles.shareText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* COMPLETE BUTTON */}
        <TouchableOpacity
          style={[
            styles.completeBtn,
            message.trim().length === 0 && styles.disabledBtn,
          ]}
          disabled={message.trim().length === 0}
          onPress={handleSubmit}
        >
          <Text style={styles.completeText}>Mark as Completed</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    marginBottom: 12,
    marginTop: 20,
    textAlign:"center"
  },
  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#222",
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    marginBottom: 10,
    marginTop: 10,
  },
  suggestionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  suggestionText: {
    fontSize: 15,
    color: "#222",
    fontFamily: "Gilroy-Regular",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#222",
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  shareLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    marginTop: 20,
    marginBottom: 10,
  },
  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  shareBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  shareText: {
    color: "#222",
    fontFamily: "Gilroy-Bold",
    fontSize: 14,
  },
  completeBtn: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  disabledBtn: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  completeText: {
    color: "#3c3d37",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
