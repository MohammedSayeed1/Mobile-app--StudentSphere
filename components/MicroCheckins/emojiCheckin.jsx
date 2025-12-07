// components/microcheckins/EmojiCheckIn.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

const EMOJI_OPTIONS = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😞", label: "Stressed" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😔", label: "Lonely" },
  { emoji: "🙏", label: "Grateful" },
  { emoji: "🌱", label: "Hopeful" },
  { emoji: "😣", label: "Guilty" },
  { emoji: "😕", label: "Conflicted" }
];

export default function EmojiCheckIn({ visible, onClose, onSelectEmotion }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>How are you feeling right now?</Text>
          <Text style={styles.subtitle}>Choose one that best fits your mood</Text>

          <View style={styles.grid}>
            {EMOJI_OPTIONS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emojiButton}
                onPress={() => {
                  onSelectEmotion(item.label);
                  onClose();
                }}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    textAlign: "center",
    color: "#555",
    marginBottom: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emojiButton: {
    width: "30%",
    alignItems: "center",
    marginVertical: 10,
  },
  emoji: {
    fontSize: 40,
  },
  label: {
    marginTop: 6,
    fontFamily: "Gilroy-Regular",
    fontSize: 13,
    color: "#333",
  },
  closeBtn: {
    marginTop: 14,
    paddingVertical: 10,
    alignSelf: "center",
  },
  closeText: {
    color: "#333",
    fontFamily: "Gilroy-Bold",
    fontSize: 15,
  },
});
