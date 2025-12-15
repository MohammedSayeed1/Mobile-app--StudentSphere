// components/tasks/SafeVoiceExpression.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { Audio } from "expo-av";

export default function SafeVoiceExpression({ task, onComplete }) {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [audioURI, setAudioURI] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ------------------------------------------------------------------
  // START RECORDING
  // ------------------------------------------------------------------
  async function startRecording() {
    try {
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) {
        return Alert.alert("Permission required", "Please enable microphone access.");
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error("Recording error:", err);
    }
  }

  // ------------------------------------------------------------------
  // STOP RECORDING
  // ------------------------------------------------------------------
  async function stopRecording() {
    console.log("Stopping recording...");
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    console.log("Recording saved at:", uri);

    setAudioURI(uri);
    setRecording(null);
  }

  // ------------------------------------------------------------------
  // PLAYBACK
  // ------------------------------------------------------------------
  async function playSound() {
    if (!audioURI) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioURI });
    setSound(sound);
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });

    await sound.playAsync();
  }

  // ------------------------------------------------------------------
  // DELETE RECORDING → COMPLETE TASK
  // ------------------------------------------------------------------
  function deleteRecording() {
    setAudioURI(null);
    setSound(null);

    Alert.alert("Released", "Your voice note has been safely released.", [
      { text: "OK", onPress: () => onComplete() },
    ]);
  }

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>🎙️ Safe Voice Expression</Text>
        <Text style={styles.description}>
          Record a short voice memo saying whatever you're feeling.  
          When you're ready, delete it — releasing the emotion safely.
        </Text>

        {/* RECORD BUTTON */}
        {!audioURI && !recording && (
          <TouchableOpacity style={styles.btn} onPress={startRecording}>
            <Text style={styles.btnText}>Start Recording</Text>
          </TouchableOpacity>
        )}

        {/* STOP RECORD BUTTON */}
        {recording && (
          <TouchableOpacity style={[styles.btn, styles.stopBtn]} onPress={stopRecording}>
            <Text style={styles.btnText}>Stop Recording</Text>
          </TouchableOpacity>
        )}

        {/* PLAYBACK & DELETE */}
        {audioURI && !recording && (
          <>
            <TouchableOpacity
              style={[styles.btn, styles.playBtn]}
              onPress={playSound}
            >
              <Text style={styles.btnText}>{isPlaying ? "Playing..." : "Play Recording"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={deleteRecording}
            >
              <Text style={styles.btnText}>Delete & Complete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#222",
    marginBottom: 30,
    lineHeight: 22,
  },

  btn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  stopBtn: {
    backgroundColor: "#E11D48",
  },

  playBtn: {
    backgroundColor: "#0EA5E9",
  },

  deleteBtn: {
    backgroundColor: "#333",
  },

  btnText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
