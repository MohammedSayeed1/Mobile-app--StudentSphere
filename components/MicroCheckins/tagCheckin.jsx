// components/microcheckins/TagsCheckIn.jsx

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";

const TAGS = [
  { name: "Tired", img: require("../../assets/images/tags/tired.jpg") },
  { name: "Overwhelmed", img: require("../../assets/images/tags/overwhelmed.jpg") },
  { name: "Excited", img: require("../../assets/images/tags/excited.jpg") },
  { name: "Confused", img: require("../../assets/images/tags/confused.jpg") },
  { name: "Calm", img: require("../../assets/images/tags/calm.jpg") },
  { name: "Motivated", img: require("../../assets/images/tags/motivated.jpg") },
];

export default function TagsCheckIn({ visible, onClose, onComplete }) {

  // Clear any selection when modal opens
  useEffect(() => {}, [visible]);

  // Direct trigger on tap
  const handleSelect = (tagName) => {
    onComplete(tagName);
    onClose(); // Close immediately
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.4}
    >
      <View style={styles.card}>
        <Text style={styles.title}>✨ Quick Tags</Text>
        <Text style={styles.subtitle}>
          Select the one that matches your state
        </Text>

        <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {TAGS.map((item, index) => (
              <View key={index} style={styles.tagWrapper}>
                <TouchableOpacity
                  onPress={() => handleSelect(item.name)}
                  style={styles.tagBox}
                >
                  <Image source={item.img} style={styles.fullImage} />
                </TouchableOpacity>

                <Text style={styles.tagText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Gilroy-Regular",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  tagWrapper: {
    width: "32%",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 2,
  },

  tagBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },

  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  tagText: {
    fontFamily: "Gilroy-Bold",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },

  cancel: {
    marginTop: 12,
  },

  cancelText: {
    color: "#C1BFC3",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
