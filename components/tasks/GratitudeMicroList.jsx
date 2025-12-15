import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GratitudeMicrolist({ task, onComplete }) {
  const [items, setItems] = useState([
    { name: "", reason: "" },
    { name: "", reason: "" },
    { name: "", reason: "" },
  ]);
  const [saved, setSaved] = useState(false);

  const suggestions = [
    "They checked in on me",
    "They helped when I needed it",
    "They made me laugh",
    "They gave useful advice",
    "They shared something with me",
  ];

  useEffect(() => {
    // optional: prefill from last saved micro-list (if desired)
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("gratitude_microlists_last");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length === 3) {
            setItems(parsed);
          }
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const updateItem = (index, key, value) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [key]: value };
    setItems(copy);
    setSaved(false);
  };

  const applySuggestion = (index, text) => {
    updateItem(index, "reason", text);
  };

  const completedCount = items.reduce(
    (acc, it) => acc + (it.name.trim() && it.reason.trim() ? 1 : 0),
    0
  );

  const allFilled = completedCount === 3;

  const saveLocally = async () => {
    try {
      const timestamped = items.map((it) => ({ ...it, saved_at: new Date().toISOString() }));
      const existing = await AsyncStorage.getItem("gratitude_microlists") || "[]";
      const arr = JSON.parse(existing);
      arr.push({ id: Date.now(), items: timestamped });
      await AsyncStorage.setItem("gratitude_microlists", JSON.stringify(arr));
      await AsyncStorage.setItem("gratitude_microlists_last", JSON.stringify(items));
      setSaved(true);
      Alert.alert("Saved", "Your microlist was saved locally.");
    } catch (e) {
      console.log("Save error", e);
      Alert.alert("Error", "Could not save locally.");
    }
  };

  const handleComplete = async () => {
    if (!allFilled) {
      Alert.alert("Not ready", "Please fill all 3 names and reasons.");
      return;
    }

    // optional: save automatically on complete
    try {
      await saveLocally();
    } catch {}

    console.log("✅ Gratitude Microlist completed:", items);
    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>✨ Gratitude Microlist</Text>

          <Text style={styles.description}>
            List three people you're thankful for and one short reason why.
            Reflecting on these small connections builds lasting positivity.
          </Text>

          <View style={styles.progressRow}>
            <View style={styles.progressPips}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.pip,
                    items[i].name.trim() && items[i].reason.trim() ? styles.pipActive : null,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.progressText}>
              {completedCount}/3 completed
            </Text>
          </View>

          {items.map((it, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardHeading}>Person {idx + 1}</Text>

              <TextInput
                style={styles.input}
                placeholder="Name (who you're grateful for)"
                placeholderTextColor="#999"
                value={it.name}
                onChangeText={(t) => updateItem(idx, "name", t)}
              />

              <TextInput
                style={[styles.input, styles.reasonInput]}
                placeholder="Why are you grateful? (short)"
                placeholderTextColor="#999"
                value={it.reason}
                onChangeText={(t) => updateItem(idx, "reason", t)}
                multiline
                numberOfLines={2}
              />

              <View style={styles.suggestionsRow}>
                {suggestions.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.suggestionChip}
                    onPress={() => applySuggestion(idx, s)}
                  >
                    <Text style={styles.suggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.saveBtn, saved && styles.saveBtnActive]}
              onPress={saveLocally}
            >
              <Text style={styles.saveText}>{saved ? "Saved" : "Save Locally"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.completeBtn, !allFilled && styles.disabledBtn]}
              disabled={!allFilled}
              onPress={handleComplete}
            >
              <Text style={styles.completeText}>
                {allFilled ? "Mark as Completed" : "Complete all 3 to continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.32)",
  },

  container: {
    padding: 20,
    paddingBottom: 80,
  },

  title: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 8,
    marginTop: 6,
  },

  description: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 16,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  progressPips: { flexDirection: "row", marginRight: 10 },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginRight: 8,
  },
  pipActive: { backgroundColor: "#3c3d37" },

  progressText: {
    color: "#444",
    fontFamily: "Gilroy-Regular",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeading: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "rgba(250,250,250,1)",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: "#111",
    marginBottom: 10,
    fontFamily: "Gilroy-Regular",
  },

  reasonInput: {
    minHeight: 60,
  },

  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  suggestionChip: {
    backgroundColor: "rgba(60,60,60,0.06)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  suggestionText: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Gilroy-Regular",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  saveBtn: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },

  saveBtnActive: {
    backgroundColor: "#e9f1e8",
    borderColor: "#9cc79a",
  },

  saveText: {
    color: "#333",
    fontFamily: "Gilroy-Bold",
  },

  completeBtn: {
    backgroundColor: "#3c3d37",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  disabledBtn: {
    backgroundColor: "rgba(60,60,60,0.4)",
  },

  completeText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
  },
});
