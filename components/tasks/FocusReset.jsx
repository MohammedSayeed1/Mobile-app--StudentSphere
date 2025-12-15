// components/tasks/FocusReset.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function FocusReset({ task, onComplete }) {
  const TOTAL_TIME = 15 * 60; // 15 minutes in seconds
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isPaused, setPaused] = useState(false);

  const intervalRef = useRef(null);

  // 🔵 Circular progress shared value
  const progress = useSharedValue(1);

  useEffect(() => {
    if (started && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            progress.value = withTiming(0, { duration: 600 });
            setTimeout(() => onComplete(), 800);
            return 0;
          }
          progress.value = withTiming(prev / TOTAL_TIME, { duration: 600 });
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [started, isPaused]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // 🔵 Animated circle
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(0.8 + progress.value * 0.2) }],
    opacity: withTiming(progress.value),
  }));

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      {!started ? (
        // INTRO SCREEN
        <View style={styles.container}>
          <Text style={styles.title}>⏱️ 15-Minute Focus Reset</Text>
          <Text style={styles.description}>
            You’ll spend the next 15 minutes gently focusing on one task.{"\n"}
            This helps reset overwhelm and anchor your mind.
          </Text>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => setStarted(true)}
          >
            <Text style={styles.startText}>Start Focus Timer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // TIMER SCREEN
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.circle, animatedStyle]}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          </Animated.View>

          <Text style={styles.tip}>
            Stay with the task. Slow, steady focus is enough.
          </Text>

          <View style={styles.row}>
            {!isPaused ? (
              <TouchableOpacity
                style={styles.pauseBtn}
                onPress={() => setPaused(true)}
              >
                <Text style={styles.pauseText}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.resumeBtn}
                onPress={() => setPaused(false)}
              >
                <Text style={styles.resumeText}>Resume</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.endBtn}
              onPress={() => {
                clearInterval(intervalRef.current);
                onComplete();
              }}
            >
              <Text style={styles.endText}>End Early</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
 
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    flex: 1,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },

  startBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  startText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },

  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "rgba(79,70,229,0.3)",
  },

  timeText: {
    fontSize: 46,
    fontFamily: "Gilroy-Bold",
    color: "#222",
  },

  tip: {
    marginTop: 30,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  row: {
    flexDirection: "row",
    marginTop: 40,
    gap: 20,
  },

  pauseBtn: {
    backgroundColor: "#FFA726",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  pauseText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },

  resumeBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  resumeText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },

  endBtn: {
    backgroundColor: "#e53935",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  endText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },
});
