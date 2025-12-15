import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GratitudePhoto({ task, onComplete }) {
  const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState("");

  // -----------------------------
  // PICK FROM GALLERY
  // -----------------------------
  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission needed", "Allow access to gallery.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // -----------------------------
  // TAKE PHOTO
  // -----------------------------
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission needed", "Allow camera access.");
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // -----------------------------
  // SAVE TO LOCAL ALBUM
  // -----------------------------
  const saveGratitudePhoto = async () => {
    try {
      const entry = {
        photo,
        note,
        date: new Date().toISOString(),
      };

      const existing = await AsyncStorage.getItem("gratitude_photos");
      const parsed = existing ? JSON.parse(existing) : [];

      parsed.push(entry);

      await AsyncStorage.setItem("gratitude_photos", JSON.stringify(parsed));

      console.log("📸 Saved gratitude photo:", entry);
    } catch (err) {
      console.log("Error saving photo:", err);
    }
  };

  // -----------------------------
  // COMPLETE TASK
  // -----------------------------
  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert("No Photo", "Please select or take a photo first.");
      return;
    }

    await saveGratitudePhoto();
    onComplete();
  };

  const canComplete = photo !== null;

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.title}>📸 Gratitude Album</Text>

        <Text style={styles.description}>
          Capture something that brings you gratitude today — a person, a place,
          a memory, or even a small moment that made you smile.
        </Text>

        {/* SELECT OPTIONS */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.optionBtn} onPress={takePhoto}>
            <Text style={styles.optionText}>📷 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionBtn} onPress={pickFromGallery}>
            <Text style={styles.optionText}>🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* PREVIEW */}
        {photo && (
          <View style={styles.previewCard}>
            <Image source={{ uri: photo }} style={styles.preview} />
          </View>
        )}

        {/* NOTE OPTIONAL */}
        {photo && (
          <>
            <Text style={styles.sectionLabel}>Why this photo?</Text>

            <TextInput
              style={styles.input}
              placeholder="Optional: What made this moment meaningful?"
              placeholderTextColor="#aaa"
              multiline
              value={note}
              onChangeText={setNote}
            />
          </>
        )}

        {/* COMPLETE */}
        <TouchableOpacity
          style={[styles.completeBtn, !canComplete && styles.disabledBtn]}
          disabled={!canComplete}
          onPress={handleSubmit}
        >
          <Text style={styles.completeText}>
            {canComplete ? "Save & Complete" : "Add a Photo to Continue"}
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  optionBtn: {
    backgroundColor: "rgba(255,255,255,0.75)",
    padding: 14,
    borderRadius: 14,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },

  optionText: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  previewCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },

  preview: {
    width: "100%",
    height: 250,
    borderRadius: 12,
  },

  sectionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 10,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
    fontFamily: "Gilroy-Regular",
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
