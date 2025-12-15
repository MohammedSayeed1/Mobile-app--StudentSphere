import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";

export default function GratitudeBreath({ task, onComplete }) {
  const [started, setStarted] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState("Ready"); // Inhale, Hold, Exhale, Done
  const [reflection, setReflection] = useState("");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startBreathing = () => {
    setStarted(true);
    runBreathCycle();
  };

  const runBreathCycle = (currentCycle = cycle) => {
    if (currentCycle >= 3) {
      setPhase("Done");
      return;
    }
  
    // INHALE (4s)
    setPhase("Inhale");
    Animated.timing(scaleAnim, {
      toValue: 1.4,
      duration: 4000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
  
      // HOLD (2s)
      setPhase("Hold");
      Animated.timing(scaleAnim, {
        toValue: 1.45,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
  
        // EXHALE (6s)
        setPhase("Exhale");
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          
          // Correct cycle increment
          setCycle((prev) => {
            const next = prev + 1;
            runBreathCycle(next);   // <-- Pass the new value
            return next;
          });
  
        });
      });
    });
  };
  

  const handleComplete = () => {
    console.log("🌬️ Gratitude Breathing Completed");
    console.log("Reflection:", reflection);
    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🌬️ Gratitude Breathing</Text>

        {!started && (
          <>
            <Text style={styles.description}>
              Take 3 deep breaths.{"\n"}
              With each inhale, feel grounded.{"\n"}
              With each exhale, think of something you’re grateful for.
            </Text>

            <TouchableOpacity style={styles.startBtn} onPress={startBreathing}>
              <Text style={styles.startText}>Start Breathing</Text>
            </TouchableOpacity>
          </>
        )}

        {started && phase !== "Done" && (
          <>
            <Text style={styles.phaseText}>{phase}...</Text>
            <Text style={styles.cycleText}>Breath {cycle + 1} of 3</Text>

            <View style={styles.center}>
              <Animated.View
                style={[
                  styles.breathCircle,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              />
            </View>
          </>
        )}

        {phase === "Done" && (
          <>
            <Text style={styles.completeTitle}>✨ Great Job</Text>
            <Text style={styles.completeDesc}>
              If you wish, write one thing you appreciated during this exercise.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Optional reflection..."
              placeholderTextColor="#aaa"
              multiline
              value={reflection}
              onChangeText={setReflection}
            />

            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
              <Text style={styles.completeText}>Mark as Completed</Text>
            </TouchableOpacity>
          </>
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
  },
  container: { padding: 20, paddingTop: 40 },
  title: {
    fontSize: 28,
    color: "#111",
    fontFamily: "Gilroy-Bold",
    marginBottom: 10,
    textAlign:"center"
  },
  description: {
    color: "#111",
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 30,
    fontFamily: "Gilroy-Regular",
  },
  startBtn: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  startText: {
    color: "#3c3d37",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },

  phaseText: {
    fontSize: 28,
    color: "#111",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Gilroy-Bold",
  },
  cycleText: {
    textAlign: "center",
    color: "#eee",
    marginBottom: 20,
    fontSize: 16,
  },

  center: { alignItems: "center", marginTop: 40 },
  breathCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F9DFDF",
  },

  completeTitle: {
    fontSize: 24,
    color: "#111",
    fontFamily: "Gilroy-Bold",
    marginTop: 20,
  },
  completeDesc: {
    fontSize: 16,
    color: "#111",
    opacity: 0.9,
    marginBottom: 20,
    fontFamily: "Gilroy-Regular",
  },

  input: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 14,
    borderRadius: 14,
    minHeight: 80,
    color: "white",
    textAlignVertical: "top",
    marginBottom: 20,
    fontFamily: "Gilroy-Regular",
  },

  completeBtn: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  completeText: {
    color: "#3c3d37",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
