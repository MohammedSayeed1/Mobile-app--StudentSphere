import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalmQuest() {
  const router = useRouter();

  // Fonts
  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../assets/fonts/Gilroy-Bold.ttf"),
  });

  // Animations & UI states
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [stage, setStage] = useState("Inhale");
  const [seconds, setSeconds] = useState(60);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const exerciseDoneRef = useRef(false);

  const breathingStages = [
    { stage: "Inhale", duration: 4000 },
    { stage: "Hold", duration: 2000 },
    { stage: "Exhale", duration: 4000 },
  ];

  // --------------------------------------------------
  // BACKEND CONFIG
  // --------------------------------------------------
  const BASE_URL = "http://192.168.29.215:5010/";

  const [username, setUsername] = useState("");

  // ------------------------------
  // ⭐ NEW: Read username logic
  // ------------------------------
  const readUsername = async () => {
    try {
      let username = await AsyncStorage.getItem('username');
      if (!username) {
        const raw = await AsyncStorage.getItem('user');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            username = parsed?.username ?? parsed?.name ?? null;
          } catch {
            username = raw;
          }
        }
      }
      if (username && username !== 'null') return String(username).trim();
      return null;
    } catch {
      return null;
    }
  };

  // Load username from storage on mount
  useEffect(() => {
    const fetchUser = async () => {
      const name = await readUsername();
      if (name) setUsername(name);
    };
    fetchUser();
  }, []);

  // --------------------------------------------------
  // 🟦 LOAD OR CREATE STREAK (NEW LOGIC)
  // --------------------------------------------------
  const loadStreakFromAPI = async () => {
    try {
      if (!username) return;

      const res = await fetch(`${BASE_URL}/get-calm-quest?username=${username}`);
      const data = await res.json();

      if (data?.streak !== undefined) {
        setStreak(data.streak);
        await AsyncStorage.setItem("streak", data.streak.toString());
      }
    } catch (err) {
      console.log("API error, loading stored streak:", err);

      const stored = await AsyncStorage.getItem("streak");
      if (stored) setStreak(parseInt(stored));
    }
  };

  // --------------------------------------------------
  // 🟩 UPDATE STREAK AFTER COMPLETION (NEW LOGIC)
  // --------------------------------------------------
  const updateStreakInAPI = async () => {
    try {
      let user = username;
      if (!user) {
        user = await readUsername();
        if (!user) {
          console.log("No username available — cannot update streak");
          return;
        }
      }

      console.log("-> sending update-calm-quest for:", user);

      const res = await fetch(`${BASE_URL}/update-calm-quest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user }),
      });

      const json = await res.json().catch(() => null);

      console.log("update-calm-quest response:", res.status, json);

      if (res.ok && json && json.streak !== undefined) {
        setStreak(json.streak);
        await AsyncStorage.setItem("streak", String(json.streak));
      }
    } catch (err) {
      console.log("Failed to update streak (network / other):", err);
    }
  };

  // Load streak when component starts
  useEffect(() => {
    loadStreakFromAPI();
  }, [username]);

  // --------------------------------------------------
  // COUNTDOWN LOGIC — Unchanged
  // --------------------------------------------------
  useEffect(() => {
    if (!showCountdown) return;

    let counter = countdown;

    const interval = setInterval(() => {
      counter -= 1;

      if (counter === 0) {
        setCountdown("Go!");
      } else if (counter < 0) {
        clearInterval(interval);
        setShowCountdown(false);
        startBreathing();
        startTimer();
      } else {
        setCountdown(counter);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showCountdown]);

  // --------------------------------------------------
  // BREATHING ANIMATION — Unchanged
  // --------------------------------------------------
  const startBreathing = () => {
    let index = 0;

    const animate = () => {
      const current = breathingStages[index];
      setStage(current.stage);

      let toValue = current.stage === "Exhale" ? 1 : 1.45;

      Animated.timing(scaleAnim, {
        toValue,
        duration: current.duration,
        useNativeDriver: true,
      }).start(() => {
        index = (index + 1) % breathingStages.length;

        if (!exerciseCompleted) animate();
      });
    };

    animate();
  };

  // --------------------------------------------------
  // TIMER — calls updateStreakInAPI()
  // --------------------------------------------------
  const startTimer = () => {
    setSeconds(60);

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          exerciseDoneRef.current = true;
          setExerciseCompleted(true);
          updateStreakInAPI();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  // Reset
  const resetExercise = () => {
    setExerciseCompleted(false);
    setCountdown(3);
    setShowCountdown(true);
    scaleAnim.setValue(1);
  };

  if (!fontsLoaded) return null;

  // --------------------------------------------------
  // UI BELOW — COMPLETELY UNCHANGED
  // --------------------------------------------------
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.infoBtn} onPress={() => setShowInfo(true)}>
        <Ionicons name="information-circle-outline" size={30} color="#1A2A4F" />
      </TouchableOpacity>

      <Text style={styles.title}>Calm Quest</Text>

      <Text style={styles.streakText}>🔥 Streak: {streak} days</Text>

      {showCountdown && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {!exerciseCompleted && !showCountdown && (
        <Text style={styles.timerText}>{seconds}s left</Text>
      )}

      {!showCountdown && (
        <Animated.View
          style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}
        />
      )}

      {!exerciseCompleted && !showCountdown && (
        <Text style={styles.stageText}>{stage}</Text>
      )}

      {exerciseCompleted && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.doneTitle}>Exercise Completed!</Text>
            <Text style={styles.doneMsg}>
              Great job! You completed 1 minute of calm breathing.
            </Text>
            <Text style={styles.affirmationText}>
              {affirmations[Math.floor(Math.random() * affirmations.length)]}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#1A2A4F" }]}
                onPress={resetExercise}
              >
                <Text style={styles.actionText}>Repeat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#4C5C76" }]}
                onPress={() => router.back()}
              >
                <Text style={styles.actionText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Modal visible={showInfo} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Benefits of Deep Breathing</Text>
            <Text style={styles.infoPoint}>• Reduces stress and anxiety</Text>
            <Text style={styles.infoPoint}>• Improves oxygen flow</Text>
            <Text style={styles.infoPoint}>• Slows heart rate</Text>
            <Text style={styles.infoPoint}>• Enhances emotional balance</Text>
            <Text style={styles.infoPoint}>• Helps with sleep</Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Affirmations & Styles — Unchanged
const affirmations = [
  "You are getting calmer every day",
  "Your mind is becoming clearer ✨",
  "You chose peace today — be proud",
  "Slow breaths, strong mind",
  "You did amazing — keep going",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F4FF",
    alignItems: "center",
    paddingTop: 70,
  },

  backBtn: { position: "absolute", top: 50, left: 20 },
  backText: { fontSize: 18, color: "#1A2A4F", fontFamily: "Gilroy-Bold" },

  infoBtn: { position: "absolute", top: 50, right: 20 },

  title: {
    fontSize: 30,
    fontFamily: "Gilroy-Bold",
    color: "#1A2A4F",
    marginBottom: 20,
  },

  streakText: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#34506E",
    marginBottom: 10,
  },

  countdownContainer: { marginTop: 90 },
  countdownText: {
    fontSize: 75,
    fontFamily: "Gilroy-Bold",
    color: "#1A2A4F",
  },

  timerText: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#1A2A4F",
    marginBottom: 20,
  },

  circle: {
    width: 180,
    height: 180,
    backgroundColor: "#BEE8FF",
    borderRadius: 200,
    opacity: 0.9,
    marginTop: 50,
  },

  stageText: {
    fontSize: 28,
    marginTop: 40,
    color: "#1A2A4F",
    fontFamily: "Gilroy-Bold",
  },

  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.4)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  overlayCard: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
  },

  doneTitle: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#1A2A4F",
    marginBottom: 10,
  },

  doneMsg: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#34506E",
    textAlign: "center",
    marginBottom: 20,
  },

  affirmationText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    textAlign: "center",
    color: "#1A2A4F",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-between",
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  infoCard: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },

  infoTitle: {
    fontSize: 22,
    fontFamily: "Gilroy-Bold",
    color: "#1A2A4F",
    textAlign: "center",
    marginBottom: 15,
  },

  infoPoint: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#34506E",
    marginVertical: 5,
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: "#1A2A4F",
    paddingVertical: 10,
    borderRadius: 10,
  },

  closeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
