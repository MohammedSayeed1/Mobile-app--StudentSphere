// components/tasks/SavorPhoto.jsx
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SavorPhoto({ task, onComplete }) {
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert local uri -> base64 (safe method)
  const convertToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1]; // remove metadata
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const choosePhoto = () => {
    Alert.alert("Choose Photo", "Select an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const canComplete = photo && caption.trim().length > 3;

  const uploadToMemoryBox = async () => {
    try {
      setLoading(true);

      // read username from AsyncStorage
      let username = await AsyncStorage.getItem("username");
      if (!username) {
        const raw = await AsyncStorage.getItem("user");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            username = parsed?.username ?? parsed?.name ?? null;
          } catch {
            username = raw;
          }
        }
      }
      username = username && username !== "null" ? String(username).trim() : null;

      if (!username) {
        Alert.alert("No user", "Could not find username in local storage.");
        setLoading(false);
        return;
      }

      if (!photo) {
        Alert.alert("No Photo", "Please attach a photo first.");
        setLoading(false);
        return;
      }

      // convert to base64
      const base64 = await convertToBase64(photo);
      // try to guess mime from uri (simple)
      const mime = photo.endsWith(".png") ? "image/png" : "image/jpeg";

      const payload = {
        username,
        image_base64: base64, // matches backend expectation
        caption: caption.trim(),
        mime,
      };

      console.log("📤 Uploading memory (size chars):", payload.image_base64?.length ?? 0);

      const resp = await fetch("https://studentsphere-mobile-app-backend.onrender.com/save-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      // check network-level response
      if (!resp) throw new Error("No response from server");

      const json = await resp.json().catch((e) => {
        console.log("📥 JSON parse error:", e);
        throw new Error("Invalid JSON from server");
      });

      console.log("📥 Backend response:", json);

      if (resp.ok && (json.message || json.success)) {
        // success: call onComplete AFTER upload works
        Alert.alert("Saved", "Memory saved to Memory Box.");
        onComplete && onComplete();
      } else {
        const err = json.error || json.message || "Upload failed";
        Alert.alert("Upload Failed", String(err));
      }
    } catch (e) {
      console.log("Upload error:", e);
      Alert.alert("Upload Failed", e.message || "Could not save your memory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📸 Savoring Photo</Text>

        <Text style={styles.description}>
          Capture something that made you smile today.{"\n"}A small moment can hold big joy — savor it.
        </Text>

        {photo ? (
          <View style={styles.polaroid}>
            <Image source={{ uri: photo }} style={styles.polaroidImage} />
            <View style={styles.captionArea}>
              <Text style={styles.captionPreview}>{caption || "Your caption here..."}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoPicker} onPress={choosePhoto}>
            <Text style={styles.photoPickerText}>+ Add a Photo</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionLabel}>Why did this moment make you smile?</Text>

        <TextInput
          style={styles.input}
          placeholder="Write one sentence..."
          placeholderTextColor="#777"
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        {loading && <ActivityIndicator size="large" color="#3c3d37" />}

        <TouchableOpacity
          style={[styles.completeBtn, !canComplete && styles.disabledBtn]}
          disabled={!canComplete || loading}
          onPress={uploadToMemoryBox}
        >
          <Text style={styles.completeText}>{canComplete ? "Save & Complete" : "Add photo + caption"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.4)" },
  container: { padding: 20, paddingBottom: 50 },
  title: { fontSize: 28, color: "#111", fontFamily: "Gilroy-Bold", marginTop: 20, marginBottom: 10, textAlign: "center" },
  description: { fontSize: 16, color: "#333", fontFamily: "Gilroy-Regular", marginBottom: 20, textAlign: "center" },
  photoPicker: { backgroundColor: "rgba(255,255,255,0.8)", padding: 30, borderRadius: 16, borderWidth: 2, borderColor: "#ddd", alignItems: "center", marginBottom: 20 },
  photoPickerText: { fontSize: 18, color: "#555", fontFamily: "Gilroy-Bold" },
  polaroid: { backgroundColor: "white", paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 50, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, elevation: 4, marginBottom: 30, borderRadius: 12 },
  polaroidImage: { width: 250, height: 250, borderRadius: 6, resizeMode: "cover" },
  captionArea: { marginTop: 10, backgroundColor: "#fff", width: "100%", paddingVertical: 8 },
  captionPreview: { textAlign: "center", fontFamily: "Gilroy-Regular", fontSize: 14, color: "#333" },
  sectionLabel: { fontSize: 16, color: "#111", fontFamily: "Gilroy-Bold", marginBottom: 10 },
  input: { backgroundColor: "rgba(255,255,255,0.9)", padding: 14, borderRadius: 12, minHeight: 70, textAlignVertical: "top", fontSize: 15, color: "#111", fontFamily: "Gilroy-Regular" },
  completeBtn: { backgroundColor: "#3c3d37", padding: 14, borderRadius: 16, alignItems: "center", marginTop: 30 },
  disabledBtn: { backgroundColor: "rgba(60,60,60,0.3)" },
  completeText: { color: "white", fontFamily: "Gilroy-Bold", fontSize: 16 },
});
