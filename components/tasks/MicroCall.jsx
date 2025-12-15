import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  Linking,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";

export default function MicroCall({ task, onComplete }) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [message, setMessage] = useState("");
  const [shared, setShared] = useState(false);

  const people = [
    "A close friend",
    "A sibling",
    "A cousin",
    "A classmate",
    "A mentor",
    "Someone you miss",
  ];

  const times = [
    "In 30 minutes",
    "Later today",
    "Tonight",
    "Tomorrow morning",
  ];

  const generateMessage = (person, time) => {
    if (!person || !time) return "";

    return `Hey! Can we have a quick 10-minute call ${time.toLowerCase()}? I'd love to catch up 😊`;
  };

  const handleSelectPerson = (p) => {
    setSelectedPerson(p);
    const newMsg = generateMessage(p, selectedTime);
    setMessage(newMsg);
  };

  const handleSelectTime = (t) => {
    setSelectedTime(t);
    const newMsg = generateMessage(selectedPerson, t);
    setMessage(newMsg);
  };

  const markShared = () => {
    setShared(true);
  };

  // ---------------------------
  // SEND TO WHATSAPP
  // ---------------------------
  const sendToWhatsApp = async () => {
    if (!message.trim()) {
      return Alert.alert("Message Empty", "Please complete the selections first.");
    }

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
      markShared();
    } else {
      Alert.alert("WhatsApp Not Installed", "Please install WhatsApp.");
    }
  };

  // ---------------------------
  // SEND TO SMS
  // ---------------------------
  const sendToSMS = () => {
    if (!message.trim()) {
      return Alert.alert("Message Empty", "Please complete the selections first.");
    }

    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`);
    markShared();
  };

  // ---------------------------
  // COPY MESSAGE
  // ---------------------------
  const copyToClipboard = async () => {
    if (!message.trim()) {
      return Alert.alert("Message Empty", "Please complete the selections first.");
    }

    await Clipboard.setStringAsync(message);
    Alert.alert("Copied!", "Message copied to clipboard.");
    markShared();
  };

  const handleComplete = () => {
    console.log("📞 MicroCall → Completed");
    console.log("Message:", message);
    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title */}
        <Text style={styles.title}>📞 Schedule a 10-min Call</Text>

        <Text style={styles.description}>
          Choose someone you'd like to talk to and pick a small time window.
          A short conversation can make you feel more connected.
        </Text>

        {/* Select person */}
        <Text style={styles.sectionLabel}>Who do you want to call?</Text>

        {people.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.optionCard,
              selectedPerson === p && styles.optionSelected,
            ]}
            onPress={() => handleSelectPerson(p)}
          >
            <Text style={styles.optionText}>{p}</Text>
          </TouchableOpacity>
        ))}

        {/* Select time */}
        <Text style={styles.sectionLabel}>When?</Text>

        {times.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.optionCard,
              selectedTime === t && styles.optionSelected,
            ]}
            onPress={() => handleSelectTime(t)}
          >
            <Text style={styles.optionText}>{t}</Text>
          </TouchableOpacity>
        ))}

        {/* Generated Message */}
        <Text style={styles.sectionLabel}>Your message:</Text>

        <TextInput
          style={styles.input}
          placeholder="Your message will appear here..."
          placeholderTextColor="#aaa"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* Sharing buttons */}
        <Text style={styles.sectionLabel}>Share via:</Text>

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

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeBtn,
            !shared && styles.disabledBtn,
          ]}
          disabled={!shared}
          onPress={handleComplete}
        >
          <Text style={styles.completeText}>
            {shared ? "Mark as Completed" : "Complete by Sharing"}
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
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  container: { padding: 20, paddingBottom: 40 },

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
    color: "#333",
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 12,
  },

  optionCard: {
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: "#3c3d37",
  },
  optionText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    minHeight: 100,
    textAlignVertical: "top",
  },

  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  shareBtn: {
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  shareText: {
    color: "#111",
    fontFamily: "Gilroy-Bold",
    fontSize: 14,
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 14,
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
