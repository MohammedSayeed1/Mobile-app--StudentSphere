// components/tasks/ValuesCheck.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function ValuesCheck({ task, onComplete }) {
  const [step, setStep] = useState(0);

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const [selectedValues, setSelectedValues] = useState([]);
  const [customValue, setCustomValue] = useState("");

  // ratings stored as objects: { "Growth": 4, ... }
  const [ratingsA, setRatingsA] = useState({});
  const [ratingsB, setRatingsB] = useState({});

  const coreValues = [
    "Growth",
    "Health",
    "Relationships",
    "Honesty",
    "Stability",
    "Learning",
    "Freedom",
    "Creativity",
  ];

  // --- Helpers (ProsCons-style) ---
  const StepContainer = ({ children }) => (
    <Animated.View
      key={step}
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.card}
    >
      {children}
    </Animated.View>
  );

  const toggleValue = (v) => {
    if (selectedValues.includes(v)) {
      setSelectedValues(selectedValues.filter((x) => x !== v));
      // remove ratings for removed value
      setRatingsA((r) => {
        const copy = { ...r };
        delete copy[v];
        return copy;
      });
      setRatingsB((r) => {
        const copy = { ...r };
        delete copy[v];
        return copy;
      });
    } else if (selectedValues.length < 3) {
      setSelectedValues([...selectedValues, v]);
    }
  };

  const addCustomValue = () => {
    if (customValue.trim() && selectedValues.length < 3) {
      const trimmed = customValue.trim();
      setSelectedValues([...selectedValues, trimmed]);
      setCustomValue("");
    }
  };

  const isAllRated = (ratingsObj) =>
    selectedValues.every((v) => !!ratingsObj[v]);

  const finish = () => {
    console.log("🌟 Values Check Completed");
    console.log({ optionA, optionB, selectedValues, ratingsA, ratingsB });
    onComplete();
  };

  const RatingRow = ({ ratings, setRatings }) => (
    <>
      {selectedValues.map((v) => (
        <View key={v} style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>{v}</Text>
          <View style={styles.ratingButtons}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.ratingCircle,
                  ratings[v] === num && styles.ratingSelected,
                ]}
                onPress={() => setRatings({ ...ratings, [v]: num })}
              >
                <Text style={styles.ratingNum}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>💛 Values Check</Text>

          {/* STEP 0 — Enter Options */}
          {step === 0 && (
            <StepContainer>
              <Text style={styles.prompt}>
                ✨ What two options are you choosing between?
              </Text>

              <TextInput
                style={styles.input}
                value={optionA}
                onChangeText={setOptionA}
                placeholder="Option A..."
                placeholderTextColor="#666"
              />

              <TextInput
                style={styles.input}
                value={optionB}
                onChangeText={setOptionB}
                placeholder="Option B..."
                placeholderTextColor="#666"
              />

              <TouchableOpacity
                style={[styles.button, !(optionA && optionB) && styles.disabled]}
                disabled={!(optionA && optionB)}
                onPress={() => setStep(1)}
              >
                <Text style={styles.buttonText}>Next →</Text>
              </TouchableOpacity>
            </StepContainer>
          )}

          {/* STEP 1 — Select Values */}
          {step === 1 && (
            <StepContainer>
              <Text style={styles.prompt}>
                Pick 3 values that matter most to you right now.
              </Text>

              <View style={{ marginBottom: 12 }}>
                {coreValues.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[
                      styles.valueChip,
                      selectedValues.includes(v) && styles.valueSelected,
                    ]}
                    onPress={() => toggleValue(v)}
                  >
                    <Text
                      style={[
                        styles.valueText,
                        selectedValues.includes(v) && styles.valueTextSelected,
                      ]}
                    >
                      {v}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Value */}
              <TextInput
                style={styles.input}
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="Add your own value..."
                placeholderTextColor="#666"
              />

              <TouchableOpacity
                style={[
                  styles.smallButton,
                  (!customValue.trim() || selectedValues.length >= 3) &&
                    styles.disabledSmall,
                ]}
                disabled={!customValue.trim() || selectedValues.length >= 3}
                onPress={addCustomValue}
              >
                <Text style={styles.smallButtonText}>Add</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, selectedValues.length !== 3 && styles.disabled]}
                disabled={selectedValues.length !== 3}
                onPress={() => setStep(2)}
              >
                <Text style={styles.buttonText}>Next →</Text>
              </TouchableOpacity>
            </StepContainer>
          )}

          {/* STEP 2 — Rate Option A */}
          {step === 2 && (
            <StepContainer>
              <Text style={styles.heading}>Option A: {optionA}</Text>
              <Text style={styles.prompt}>Rate how well it aligns with each value.</Text>

              <RatingRow ratings={ratingsA} setRatings={setRatingsA} />

              <TouchableOpacity
                style={[styles.button, !isAllRated(ratingsA) && styles.disabled]}
                disabled={!isAllRated(ratingsA)}
                onPress={() => setStep(3)}
              >
                <Text style={styles.buttonText}>Next →</Text>
              </TouchableOpacity>
            </StepContainer>
          )}

          {/* STEP 3 — Rate Option B */}
          {step === 3 && (
            <StepContainer>
              <Text style={styles.heading}>Option B: {optionB}</Text>
              <Text style={styles.prompt}>Rate how well it aligns with each value.</Text>

              <RatingRow ratings={ratingsB} setRatings={setRatingsB} />

              <TouchableOpacity
                style={[styles.button, !isAllRated(ratingsB) && styles.disabled]}
                disabled={!isAllRated(ratingsB)}
                onPress={finish}
              >
                <Text style={styles.buttonText}>Finish</Text>
              </TouchableOpacity>
            </StepContainer>
          )}
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
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  container: { padding: 20, paddingBottom: 50 },
  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 16,
    borderRadius: 16,
  },
  prompt: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    marginBottom: 12,
    color: "#222",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },
  heading: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    marginBottom: 12,
    color: "#222",
  },
  valueChip: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginBottom: 8,
  },
  valueSelected: {
    backgroundColor: "#4F46E5",
  },
  valueText: {
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },
  valueTextSelected: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },
  smallButton: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledSmall: {
    backgroundColor: "#bbb",
  },
  smallButtonText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  disabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "white",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
  ratingRow: {
    marginBottom: 15,
  },
  ratingLabel: {
    fontFamily: "Gilroy-Bold",
    marginBottom: 8,
    fontSize: 15,
  },
  ratingButtons: {
    flexDirection: "row",
    gap: 10,
  },
  ratingCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingSelected: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  ratingNum: {
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },
});
