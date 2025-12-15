// components/tasks/WriteItOut.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * WriteItOut Task Screen
 *
 * Props:
 *  - task: { id, title, description, duration (minutes) ... }
 *  - onComplete: () => void
 *
 * Behaviour:
 *  - Countdown timer using task.duration (default 5m)
 *  - Autosave to AsyncStorage every 30s
 *  - Try to POST to /save-journal (if available). If fails, keep local copy.
 *  - Finish button saves final entry and calls onComplete.
 */

const AUTOSAVE_INTERVAL_MS = 30_000; // autosave every 30s
const BACKEND_SAVE_URL = "https://studentsphere-mobile-app-backend.onrender.com/save-journal"; // change if different

export default function WriteItOut({ task = {}, onComplete }) {
  const durationMinutes = Number(task.duration) || 5;
  const totalSeconds = durationMinutes * 60;

  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef(null);
  const autosaveRef = useRef(null);

  // load any previously autosaved draft for this task+user
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(`writeitout_draft_${task.id}`);
        if (mounted && stored) {
          const obj = JSON.parse(stored);
          if (obj?.text) setText(obj.text);
          if (obj?.secondsLeft) setSecondsLeft(obj.secondsLeft);
        }
      } catch (e) {
        console.log("WriteItOut: load draft error", e);
      }
    })();
    return () => (mounted = false);
  }, [task.id]);

  // Timer effect
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            // stop at 0
            clearInterval(timerRef.current);
            setRunning(false);
            handleFinishAuto(); // auto-save & complete when time's up
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Autosave interval
  useEffect(() => {
    // start autosave loop only when component mounted
    autosaveRef.current = setInterval(() => {
      autosaveDraft();
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      if (autosaveRef.current) {
        clearInterval(autosaveRef.current);
        autosaveRef.current = null;
      }
    };
  }, [text, secondsLeft]);

  const autosaveDraft = async () => {
    try {
      const draft = {
        text,
        secondsLeft,
        savedAt: new Date().toISOString(),
        taskId: task.id,
      };
      await AsyncStorage.setItem(`writeitout_draft_${task.id}`, JSON.stringify(draft));
      // attempt backend save (non-blocking)
      try {
        const username = await AsyncStorage.getItem("username");
        if (username) {
          fetch(BACKEND_SAVE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              username,
              entry: text,
              task_id: task.id,
              draft: true,
              created_at: new Date().toISOString(),
            }),
          }).catch((err) => {
            // ignore network error — local draft persists
            console.log("WriteItOut: backend autosave failed", err?.message || err);
          });
        }
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.log("WriteItOut: autosave failed", e);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartPause = () => {
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const handleFinishAuto = async () => {
    // Called when time up; will save final and call onComplete
    await handleSaveFinal(true);
  };

  const handleSaveFinal = async (autoCalled = false) => {
    setSaving(true);
    try {
      const username = await AsyncStorage.getItem("username");
      const payload = {
        username,
        entry: text,
        task_id: task.id,
        created_at: new Date().toISOString(),
      };

      // Try backend save first
      try {
        const resp = await fetch(BACKEND_SAVE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });

        if (resp.ok) {
          await AsyncStorage.removeItem(`writeitout_draft_${task.id}`); // clear draft
          setSaving(false);
          if (!autoCalled) Alert.alert("Saved", "Your entry was saved.");
          onComplete && onComplete();
          return;
        } else {
          console.log("WriteItOut: backend save responded not ok");
        }
      } catch (e) {
        console.log("WriteItOut: backend save error", e?.message || e);
      }

      // Fallback: save locally with timestamp
      const localKey = `writeitout_final_${task.id}_${Date.now()}`;
      await AsyncStorage.setItem(
        localKey,
        JSON.stringify({
          username: await AsyncStorage.getItem("username"),
          entry: text,
          task_id: task.id,
          created_at: new Date().toISOString(),
        })
      );
      // remove draft
      await AsyncStorage.removeItem(`writeitout_draft_${task.id}`);

      setSaving(false);
      if (!autoCalled) Alert.alert("Saved locally", "No backend — saved locally.");
      onComplete && onComplete();
    } catch (err) {
      setSaving(false);
      console.log("WriteItOut: final save failed", err);
      Alert.alert("Save failed", "Could not save your entry. It remains in a draft.");
    }
  };

  const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{task.title || "Write It Out"}</Text>
          <Text style={styles.description}>
            {task.description || "Free-write your thoughts. Let feelings flow — no rules."}
          </Text>

          <View style={styles.timerRow}>
            <Text style={styles.timerLabel}>Time</Text>
            <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
            <Text style={styles.timerLabel}>{durationMinutes} min</Text>
          </View>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Write whatever is on your mind..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
            returnKeyType="default"
          />

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Words: {words}</Text>
            <Text style={styles.metaText}>Chars: {chars}</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlBtn} onPress={handleStartPause}>
              <Text style={styles.controlText}>{running ? "Pause" : "Start"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn} onPress={handleReset}>
              <Text style={styles.controlText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: "#2d8cff" }]}
              onPress={() =>
                Alert.alert(
                  "Finish writing?",
                  "This will save your entry and mark the task complete.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Finish",
                      onPress: () => handleSaveFinal(false),
                      style: "destructive",
                    },
                  ]
                )
              }
            >
              <Text style={[styles.controlText, { color: "white" }]}>
                Finish
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.smallText}>
              Autosaves every 30s. {saving ? "Saving..." : ""}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.28)" },

  container: { flex: 1, padding: 20, justifyContent: "center" },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  title: { fontSize: 24, fontFamily: "Gilroy-Bold", color: "#111", marginBottom: 6 },
  description: { fontSize: 14, fontFamily: "Gilroy-Regular", color: "#333", marginBottom: 12 },

  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timerLabel: { fontSize: 13, color: "#666" },
  timer: { fontSize: 20, fontFamily: "Gilroy-Bold", color: "#1A2A4F" },

  input: {
    minHeight: 160,
    maxHeight: 420,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    fontSize: 16,
    color: "#111",
    marginBottom: 12,
  },

  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  metaText: { color: "#666", fontSize: 13 },

  controlsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 8 },
  controlBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 10,
    minWidth: 90,
    alignItems: "center",
  },
  controlText: { fontSize: 14, color: "#111", fontFamily: "Gilroy-Bold" },

  footerRow: { marginTop: 8, alignItems: "center" },
  smallText: { color: "#666", fontSize: 12 },
});
