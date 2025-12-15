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

export default function ShareJoy({ task, onComplete }) {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [actionTaken, setActionTaken] = useState(false);

  const emojis = ["😄", "🌟", "🎉", "✨", "💛", "😁", "🌈"];

  // VALIDATION
  const messageValid = message.trim().length >= 5;
  const canComplete = messageValid && emoji && actionTaken;

  // -------------------------------
  // SEND OPTIONS
  // -------------------------------
  const sendWhatsApp = async () => {
    if (!messageValid || !emoji) return showValidationError();

    const text = emoji + " " + message;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
      setActionTaken(true);
    } else {
      Alert.alert("WhatsApp Not Installed");
    }
  };

  const sendSMS = () => {
    if (!messageValid || !emoji) return showValidationError();

    Linking.openURL(`sms:&body=${encodeURIComponent(emoji + " " + message)}`);
    setActionTaken(true);
  };

  const copyText = async () => {
    if (!messageValid || !emoji) return showValidationError();

    await Clipboard.setStringAsync(emoji + " " + message);
    Alert.alert("Copied!", "Your joyful message is copied.");
    setActionTaken(true);
  };

  const saveOnly = () => {
    if (!messageValid || !emoji) return showValidationError();

    Alert.alert("Saved", "Your joyful moment is saved privately.");
    setActionTaken(true);
  };

  const showValidationError = () => {
    Alert.alert(
      "Finish Your Message",
      "Write a joyful message and select an emoji before sharing!"
    );
  };

  const handleSubmit = () => {
    onComplete();
  };

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
        {/* TITLE */}
        <Text style={styles.title}>🎉 Share the Joy</Text>

        <Text style={styles.description}>
          Think of one good thing that happened today.{"\n"}
          Send a cheerful message to someone — joy grows when shared!
        </Text>

        {/* MESSAGE BOX */}
        <Text style={styles.sectionLabel}>Your joyful message:</Text>

        <TextInput
          style={styles.input}
          placeholder="Something good that happened..."
          placeholderTextColor="#777"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* EMOJI SELECTOR */}
        <Text style={styles.sectionLabel}>Pick an emoji:</Text>

        <View style={styles.emojiRow}>
          {emojis.map((e, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.emojiBtn,
                emoji === e && styles.emojiSelected
              ]}
              onPress={() => setEmoji(e)}
            >
              <Text style={styles.emojiText}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEND OPTIONS */}
        <Text style={styles.sectionLabel}>Share via:</Text>

        <View style={styles.shareRow}>
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

        {/* COMPLETE BUTTON */}
        <TouchableOpacity
          style={[styles.completeBtn, !canComplete && styles.disabledBtn]}
          disabled={!canComplete}
          onPress={handleSubmit}
        >
          <Text style={styles.completeText}>
            {canComplete ? "Mark as Completed" : "Share joy to continue"}
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
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  container: {
    padding: 20,
    paddingBottom: 70,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginTop: 20,
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Gilroy-Regular",
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 16,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    color: "#111",
    minHeight: 90,
    textAlignVertical: "top",
    fontFamily: "Gilroy-Regular",
  },

  emojiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },

  emojiBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginRight: 10,
    marginBottom: 10,
  },
  emojiSelected: {
    borderWidth: 2,
    borderColor: "#3c3d37",
  },
  emojiText: {
    fontSize: 22,
  },

  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  shareBtn: {
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  shareText: {
    color: "#111",
    fontFamily: "Gilroy-Bold",
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "rgba(60,60,60,0.4)",
  },
  completeText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
  },
});
