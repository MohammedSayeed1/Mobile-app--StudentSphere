import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  ImageBackground,
} from "react-native";

export default function BoxBreathing({ task, onComplete }) {
  const [phase, setPhase] = useState("Ready");
  const [cycle, setCycle] = useState(0);
  const [started, setStarted] = useState(false);
  const [selectedCycles, setSelectedCycles] = useState(3); // default 3

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cycleRef = useRef(0);

  const cycleOptions = [3, 4, 5, 6];

  const startBreathing = () => {
    setStarted(true);
    cycleRef.current = 0;
    setCycle(0);
    runCycle();
  };

  const runCycle = () => {
    if (cycleRef.current >= selectedCycles) {
      setPhase("Done");
      return;
    }

    // INHALE
    setPhase("Inhale");
    Animated.timing(scaleAnim, {
      toValue: 1.4,
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {

      // HOLD
      setPhase("Hold");
      Animated.timing(scaleAnim, {
        toValue: 1.45,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {

        // EXHALE
        setPhase("Exhale");
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          cycleRef.current += 1;
          setCycle(cycleRef.current);
          runCycle();
        });

      });
    });
  };

  const handleComplete = () => {
    console.log("🌬️ Box Breathing Completed for", selectedCycles, "cycles");
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

        <Text style={styles.title}>🌬️ Box Breathing 4-4-4</Text>

        {!started && (
          <>
            <Text style={styles.description}>
              Choose how many breathing cycles you'd like to do.
            </Text>

            {/* CYCLE SELECTOR */}
            <View style={styles.cycleSelector}>
              {cycleOptions.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.cycleBtn,
                    selectedCycles === num && styles.cycleBtnSelected,
                  ]}
                  onPress={() => setSelectedCycles(num)}
                >
                  <Text
                    style={[
                      styles.cycleBtnText,
                      selectedCycles === num && styles.cycleBtnTextSelected,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={startBreathing}>
              <Text style={styles.startText}>
                Start {selectedCycles}-Cycle Breathing
              </Text>
            </TouchableOpacity>
          </>
        )}

        {started && phase !== "Done" && (
          <>
            <Text style={styles.phaseText}>{phase}...</Text>
            <Text style={styles.cycleText}>
              Cycle {cycle} of {selectedCycles}
            </Text>

            <View style={styles.center}>
              <Animated.View
                style={[
                  styles.circle,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              />
            </View>
          </>
        )}

        {phase === "Done" && (
          <>
            <Text style={styles.completeTitle}>✨ Well Done</Text>

            <Text style={styles.completeDesc}>
              You completed {selectedCycles} calming breath cycles.{"\n"}
              Your breath is your anchor. 🌿
            </Text>

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
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    color: "#111",
    fontFamily: "Gilroy-Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  cycleSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    columnGap: 10,
    flexWrap: "wrap",
  },

  cycleBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.4)",
    margin: 5,
  },

  cycleBtnSelected: {
    backgroundColor: "#3c3d37",
  },

  cycleBtnText: {
    color: "#111",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },

  cycleBtnTextSelected: {
    color: "white",
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
    fontSize: 32,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },
  cycleText: {
    textAlign: "center",
    color: "#444",
    fontSize: 16,
    marginBottom: 20,
    fontFamily:"Gilroy-Bold"
  },

  center: { alignItems: "center", marginTop: 40 },

  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#D6EAF8",
  },

  completeTitle: {
    fontSize: 26,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Gilroy-Bold",
  },

  completeDesc: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  completeText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
