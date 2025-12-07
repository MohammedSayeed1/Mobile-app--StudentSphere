import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import Slider from '@react-native-community/slider';

export default function SliderCheckin({ isVisible, onClose, onSubmit }) {
  const [value, setValue] = useState(5); // default mid value

  const handleSubmit = () => {
    if (onSubmit) onSubmit(value);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Happimeter 🎚️</Text>
          <Text style={styles.subtitle}>How happy do you feel right now?</Text>

          <Text style={styles.valueText}>{value}/10</Text>

          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={value}
            onValueChange={(v) => setValue(v)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4CAF50"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
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
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: "Gilroy-Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    color: "#555",
  },
  valueText: {
    textAlign: "center",
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    marginBottom: 10,
    color: "#333",
  },
  submitBtn: {
    backgroundColor: "#3c3d37",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
  closeBtn: {
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    fontFamily: "Gilroy-Bold",
    fontSize: 15,
    color: "#3c3d37",
  },
});
