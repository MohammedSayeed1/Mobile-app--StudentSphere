import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";

export default function CozyRitual({ task, onComplete }) {
  // -----------------------------
  // SELECTABLE OPTIONS
  // -----------------------------
  const cozyElements = [
    "Warm blanket",
    "Soft pillow",
    "Dim lights",
    "Warm drink",
    "Gentle music",
    "Scented candle",
    "Favorite sweater",
    "Fresh air (open window)",
  ];

  const vibeOptions = [
    "Play calming music",
    "Dim the lights",
    "Prepare a warm drink",
    "Open window for fresh air",
  ];

const audioOptions = [
  { title: "Rain Sounds", file: require("../../assets/sounds/rain.mp3") },
  { title: "Calm Ambient", file: require("../../assets/sounds/calmambient.mp3") },
  { title: "Soft Piano", file: require("../../assets/sounds/piano.mp3") },

  ];

  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);

  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(12 * 60); // 12 minutes

  const soundRef = useRef(null);

  // -----------------------------
  // TIMER LOGIC
  // -----------------------------
  useEffect(() => {
    let interval = null;

    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (secondsLeft <= 0) {
      clearInterval(interval);
      stopAudio();
      onComplete();
    }

    return () => clearInterval(interval);
  }, [timerActive, secondsLeft]);

  // -----------------------------
  // AUDIO PLAYBACK
  // -----------------------------
  const playAudio = async () => {
    if (!selectedAudio) return;

    stopAudio(); // stop previous audio if any

    const { sound } = await Audio.Sound.createAsync(
      { uri: selectedAudio.url },
      { shouldPlay: true, isLooping: true }
    );

    soundRef.current = sound;
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // -----------------------------
  // TOGGLE LOGIC
  // -----------------------------
  const toggleElement = (item) => {
    if (selectedElements.includes(item)) {
      setSelectedElements(selectedElements.filter((i) => i !== item));
    } else {
      setSelectedElements([...selectedElements, item]);
    }
  };

  const startRitual = () => {
    if (!selectedAudio) return;
    playAudio();
    setTimerActive(true);
  };

  const formatTime = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const canStart =
    selectedElements.length >= 2 && selectedVibe !== null && selectedAudio !== null;

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🕯️ Create a Cozy Space</Text>
        <Text style={styles.description}>
        Creating a cozy space can help your mind feel safe and grounded.{"\n"}
        Choose a few comforting elements and set a relaxing vibe.{"\n"}
        Then enjoy a 12-minute moment of calm just for yourself.
        </Text>


        {!timerActive && (
          <>
            <Text style={styles.sectionLabel}>Choose at least 2 cozy elements:</Text>

            {cozyElements.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.optionCard,
                  selectedElements.includes(item) && styles.optionSelected,
                ]}
                onPress={() => toggleElement(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedElements.includes(item) && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionLabel}>Choose a vibe:</Text>

            {vibeOptions.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.optionCard,
                  selectedVibe === item && styles.optionSelected,
                ]}
                onPress={() => setSelectedVibe(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedVibe === item && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionLabel}>Choose background audio:</Text>

            {audioOptions.map((audio, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.audioCard,
                  selectedAudio?.url === audio.url && styles.optionSelected,
                ]}
                onPress={() => setSelectedAudio(audio)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedAudio?.url === audio.url && styles.optionTextSelected,
                  ]}
                >
                  🎵 {audio.title}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.startBtn, !canStart && styles.disabledBtn]}
              disabled={!canStart}
              onPress={startRitual}
            >
              <Text style={styles.startText}>Start 12-Minute Cozy Time</Text>
            </TouchableOpacity>
          </>
        )}

        {/* TIMER VIEW */}
        {timerActive && (
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>✨ Enjoy Your Cozy Ritual ✨</Text>
            <Text style={styles.countdown}>{formatTime()}</Text>

            <TouchableOpacity
              style={styles.stopBtn}
              onPress={() => {
                stopAudio();
                onComplete();
              }}
            >
              <Text style={styles.stopText}>End Early</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0,0,0,0.25)",
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 20,
    marginTop: 20,
    textAlign:"center"
  },
  sectionLabel: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginTop: 16,
    marginBottom: 8,
  },

  optionCard: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    // elevation: 2,
  },
  audioCard: {
    backgroundColor: "rgba(255,255,255,0.20)",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#ffffff",
    borderColor: "#3c3d37",
    borderWidth: 2,
  },
  optionText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },
  optionTextSelected: {
    color: "#3c3d37",
    fontFamily: "Gilroy-Bold",
  },

  startBtn: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
  disabledBtn: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  startText: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "white",
  },

  timerBox: {
    marginTop: 60,
    alignItems: "center",
  },
  timerText: {
    fontSize: 22,
    color: "#111",
    fontFamily: "Gilroy-Bold",
    marginBottom: 10,
  },
  countdown: {
    fontSize: 48,
    color: "#111",
    fontFamily: "Gilroy-Bold",
  },
  stopBtn: {
    marginTop: 25,
    padding: 12,
    backgroundColor: "#111",
    borderRadius: 14,
  },
  stopText: {
    fontSize: 16,
    color: "#3c3d37",
    fontFamily: "Gilroy-Bold",
  },
  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    marginBottom: 20,
    opacity: 0.9,
    textAlign:"justify"
  },
  
});
