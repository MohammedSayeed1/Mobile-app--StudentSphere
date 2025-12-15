// components/tasks/TaskSuccessVisualization.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
  Platform,
} from "react-native";

const DEFAULT_DURATION_SEC = 4 * 60; // 4 minutes

export default function TaskSuccessVisualization({ task, onComplete }) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(DEFAULT_DURATION_SEC);
  const intervalRef = useRef(null);

  // pulsing animation
  const pulse = useRef(new Animated.Value(1)).current;

  // prompts that change through the session (every 30s)
  const prompts = [
    "Settle your posture. Breathe slowly and deeply.",
    "Picture yourself starting the task with calm confidence.",
    "Imagine each step unfolding smoothly — see details.",
    "Feel the satisfaction of successful completion.",
    "Take in the positive outcome — how it feels.",
    "Bring your attention back to breath, and stay present.",
    "Affirm: I can do this. I will start calmly.",
    "Slowly prepare to return — remember this feeling."
  ];

  // compute which prompt index based on elapsed time
  const getPrompt = (elapsedSec) => {
    const blocks = Math.ceil(DEFAULT_DURATION_SEC / prompts.length); // secs per prompt
    const idx = Math.min(
      prompts.length - 1,
      Math.floor(elapsedSec / blocks)
    );
    return prompts[idx] || "";
  };

  useEffect(() => {
    // run pulse loop when running; stop when not
    if (running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.12,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }

    return () => {
      pulse.stopAnimation();
    };
  }, [running, pulse]);

  useEffect(() => {
    if (running) {
      // tick every 1 second
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            // small delay so UI can show 0 then call onComplete
            setTimeout(() => {
              onComplete && onComplete();
            }, 300);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, onComplete]);

  const startPause = () => setRunning((v) => !v);
  const reset = () => {
    setRunning(false);
    setRemaining(DEFAULT_DURATION_SEC);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const elapsed = DEFAULT_DURATION_SEC - remaining;
  const prompt = getPrompt(elapsed);

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>✨ Task Success Visualization</Text>

        <Text style={styles.helpText}>
          Imagine yourself completing a task step-by-step. Use this short guided visualization to build confidence and focus.
        </Text>

        <View style={styles.centerRow}>
          <Animated.View
            style={[
              styles.pulse,
              {
                transform: [{ scale: pulse }],
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 6,
              },
            ]}
          >
            <View style={styles.timerInner}>
              <Text style={styles.timerText}>{mm}:{ss}</Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.promptBox}>
          <Text style={styles.promptText}>{prompt}</Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={startPause}
            style={[styles.controlBtn, { backgroundColor: running ? "#e55" : "#4F46E5" }]}
            accessibilityLabel={running ? "Pause visualization" : "Start visualization"}
          >
            <Text style={styles.controlText}>{running ? "Pause" : "Start"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={reset}
            style={[styles.controlBtn, styles.resetBtn]}
            accessibilityLabel="Reset visualization"
          >
            <Text style={styles.controlText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => { setRunning(false); onComplete && onComplete(); }}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Skip & Mark Complete</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
  },

  helpText: {
    textAlign: "center",
    color: "#333",
    fontSize: 15,
    maxWidth: 640,
    marginBottom: 18,
    fontFamily: "Gilroy-Regular",
  },

  centerRow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  pulse: {
    width: 220,
    height: 220,
    borderRadius: 220 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
  },

  timerInner: {
    width: 160,
    height: 160,
    borderRadius: 160 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  timerText: {
    fontSize: 36,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  promptBox: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    width: "100%",
    marginTop: 24,
  },

  promptText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#222",
  },

  controlsRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 12,
  },

  controlBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },

  resetBtn: {
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  controlText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },

  skipBtn: {
    marginTop: 18,
    paddingVertical: 10,
  },

  skipText: {
    color: "#666",
    textDecorationLine: "underline",
  },
});
