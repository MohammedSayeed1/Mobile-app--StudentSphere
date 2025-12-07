// JournalEntry.js (full updated file with micro-checkins integration)
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { images } from 'constants';
import CustomButton from '../../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { useFonts } from "expo-font";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';

// Micro-checkin components (adjust path if your project is different)
import EmojiCheckIn from '../../../components/MicroCheckins/emojiCheckin';
import TagsCheckIn from '../../../components/MicroCheckins/tagCheckin';
import SliderCheckin from '../../../components/MicroCheckins/sliderCheckin';

// -----------------------------
// small inline ValidationModal (updated to accept initialQuestionData prop)
// If you already have a separate ValidationModal component file, you can keep that
// and export a prop interface that matches these props. For simplicity I include it here.
// -----------------------------
// HELPER: READ USERNAME
// -----------------------------
const readUsername = async () => {
  try {
    let username = await AsyncStorage.getItem("username");

    if (!username) {
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          username = parsed?.username ?? parsed?.name ?? null;
        } catch {
          username = raw;
        }
      }
    }

    if (username && username !== "null") return String(username).trim();
    return null;
  } catch (e) {
    console.log("Error reading username:", e);
    return null;
  }
};

function ValidationModal({ isVisible, closeModal, journalEntry, initialQuestionData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState(""); // "yes_no" | "choice" | "reflection"
  const [options, setOptions] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [finalResult, setFinalResult] = useState(null);
  const [showFinalCard, setShowFinalCard] = useState(false);

  const [username, setUsername] = useState('');
  const date = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchUsername = async () => {
      const raw = await AsyncStorage.getItem('username');
      if (!raw) {
        const r = await AsyncStorage.getItem('user');
        if (r) {
          try {
            const parsed = JSON.parse(r);
            setUsername(parsed?.username ?? parsed?.name ?? '');
          } catch {
            setUsername(r || '');
          }
        }
        return;
      }
      setUsername(raw);
    };
    fetchUsername();
  }, []);

  // If backend already returned first question (initialQuestionData), use it.
  useEffect(() => {
    if (!isVisible) {
      // reset modal state on close
      setCurrentStep(1);
      setQuestionText("");
      setQuestionType("");
      setOptions([]);
      setTextAnswer("");
      setFinalResult(null);
      setShowFinalCard(false);
      setBusy(false);
      return;
    }

    if (initialQuestionData && initialQuestionData.question) {
      setQuestionText(initialQuestionData.question);
      setQuestionType(initialQuestionData.question_type || "reflection");
      setOptions(initialQuestionData.options || []);
      setCurrentStep(1);
      return;
    }

    // if no initial question provided, do nothing here — parent should call server
    // or you can implement startValidation() to call /save-journal but we avoid duplicate calls.
  }, [isVisible, initialQuestionData]);

  const submitAnswer = async (answer) => {
    if (!answer || (typeof answer === 'string' && !answer.trim())) {
      Alert.alert("Empty answer", "Please enter a response before submitting.");
      return;
    }

    let u = username;
    if (!u) {
      const raw = await AsyncStorage.getItem('username');
      if (raw) {
        u = raw;
        setUsername(u);
      } else {
        const r = await AsyncStorage.getItem('user');
        if (r) {
          try {
            const parsed = JSON.parse(r);
            u = parsed?.username ?? parsed?.name ?? '';
            setUsername(u);
          } catch {
            u = r || '';
            setUsername(u);
          }
        }
      }
    }
    if (!u) {
      Alert.alert("Error", "Please login again.");
      return;
    }

    try {
      setBusy(true);
      const resp = await fetch("http://192.168.29.215:5010/answer-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, date, answer }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        Alert.alert("Error", data?.error || "Could not submit answer.");
        setBusy(false);
        return;
      }

      if (data.complete) {
        await fetchFinalAdvice();
        return;
      }

      // set next question
      setQuestionText(data.question || "");
      setQuestionType(data.question_type || "reflection");
      setOptions(data.options || []);
      setCurrentStep((prev) => Math.min(3, prev + 1));
      setTextAnswer("");
    } catch (err) {
      console.log("Error submitting answer:", err);
      Alert.alert("Error", "Could not submit answer.");
    } finally {
      setBusy(false);
    }
  };

  const fetchFinalAdvice = async () => {
    try {
      setBusy(true);
      const resp = await fetch("http://192.168.29.215:5010/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, date }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        Alert.alert("Error", data?.error || "Could not fetch final advice.");
        return;
      }

      setFinalResult({ advice: data.advice, affirmation: data.affirmation });
      setShowFinalCard(true);
    } catch (err) {
      console.log("Error fetching final advice:", err);
      Alert.alert("Error", "Could not fetch final advice.");
    } finally {
      setBusy(false);
    }
  };

  const renderQuestionBody = () => {
    if (questionType === "yes_no") {
      return (
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity style={styles.optionBtn} onPress={() => submitAnswer("Yes")} disabled={busy}>
            <Text style={styles.optionText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn} onPress={() => submitAnswer("No")} disabled={busy}>
            <Text style={styles.optionText}>No</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (questionType === "choice") {
      return (
        <View style={{ marginTop: 10 }}>
          {options.map((opt, i) => (
            <TouchableOpacity key={i} style={styles.optionBtn} onPress={() => submitAnswer(opt)} disabled={busy}>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (questionType === "reflection") {
      return (
        <View style={{ marginTop: 10 }}>
          <TextInput
            style={styles.textField}
            placeholder="Type your response..."
            value={textAnswer}
            onChangeText={setTextAnswer}
            editable={!busy}
            multiline
          />
          <TouchableOpacity style={styles.submitBtn} onPress={() => submitAnswer(textAnswer)} disabled={busy}>
            <Text style={styles.submitText}>{busy ? "Thinking..." : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => { if (!busy) { closeModal(); } }}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.4}
    >
      <ScrollView contentContainerStyle={styles.modalContainer}>
        {!showFinalCard ? (
          <>
            <Text style={styles.modalTitle}>A quick check-in</Text>
            <Text style={styles.modalHeading}>Question {currentStep} of 3</Text>
            <Text style={styles.modalText}>{questionText}</Text>

            {busy ? (
              <View style={{ marginVertical: 12, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#3c3d37" />
                <Text style={{ marginTop: 8, fontFamily: "Gilroy-Regular" }}>Thinking...</Text>
              </View>
            ) : (
              renderQuestionBody()
            )}

            <View style={{ marginTop: 14, flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity onPress={() => { if (!busy) closeModal(); }} style={{ padding: 8 }}>
                <Text style={{ color: "#3c3d37", fontFamily: "Gilroy-Bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.modalTitle}>🌿 A small support for you</Text>

            <Text style={styles.modalHeading}>💬 Comfort Notes</Text>
            <Text style={styles.modalText}>{finalResult?.advice}</Text>

            <Text style={styles.modalHeading}>✨ Growth & Resilience</Text>
            <Text style={styles.modalText}>"{finalResult?.affirmation}"</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Continue Writing</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: "#3c3d37" }]}
                onPress={() => { 
                  closeModal(); 
                  router.push("/tasks"); // NEW ROUTE
                }}
              >
                <Text style={styles.modalButtonText}>View Tasks</Text>
              </TouchableOpacity>

            </View>
          </>
        )}
      </ScrollView>
    </Modal>
  );
}

// -----------------------------
// MAIN JOURNAL ENTRY COMPONENT
// -----------------------------
export default function JournalEntry() {
  const [entry, setEntry] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [affirmation] = useState([
    "I am enough just as I am.",
    "I choose peace over worry.",
    "Today is full of endless possibilities.",
    "I am growing and learning every day.",
    "My thoughts become my reality.",
    "I deserve love, success, and happiness.",
    "I let go of what I can’t control.",
    "I am proud of how far I’ve come."
  ][Math.floor(Math.random() * 8)]);
  const [username, setUsername] = useState('');
  const [validationVisible, setValidationVisible] = useState(false);
  const [validationInitialData, setValidationInitialData] = useState(null);

  // micro-checkin state
  const [microType, setMicroType] = useState(null); // 'emoji' | 'tags' | 'happimeter'
  const [microVisible, setMicroVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showPrivacyCard, setShowPrivacyCard] = useState(true);
  const slideAnim = useState(new Animated.Value(-100))[0];

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-RegularItalic": require("../../../assets/fonts/Gilroy-RegularItalic.ttf"),
  });

  const router = useRouter();
  if (!fontsLoaded) return null;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowPrivacyCard(false));
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const init = async () => {
      const cleanUsername = await readUsername();
      if (!cleanUsername) return;
      setUsername(cleanUsername);

      const date = new Date().toISOString().split('T')[0];
      try {
        const resp = await fetch(`http://192.168.29.215:5010/get-journal?username=${encodeURIComponent(cleanUsername)}&date=${date}`);
        const data = await resp.json();
        if (resp.ok && data) setEntry(data.text || "");
      } catch (error) {
        console.error("Fetch journal error:", error);
      }
    };
    init();
  }, []);

  // random micro-checkin selector (equal weights by default)
  const pickRandomMicro = () => {
    const list = ['emoji', 'tags', 'happimeter'];
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  };

  // when user taps Save
  const onSavePress = async () => {
    if (!entry || !entry.trim()) {
      Alert.alert("Empty journal", "Please write something before saving.");
      return;
    }

    const u = username || await readUsername();
    if (!u) {
      Alert.alert("Missing username", "Please login again.");
      return;
    }
    setUsername(u);

    // pick random micro and show its modal
    const pick = pickRandomMicro();
    setMicroType(pick);
    setMicroVisible(true);
  };

  // handle micro-complete; 'value' depends on microType format:
  // emoji => string label, tags => array of strings, happimeter => number
  const handleMicroComplete = async (type, value) => {
    setMicroVisible(false);

    // build micro payload
    const micro = { type, value };

    // send journal + micro to backend -> backend returns the first validation question (or default)
    const date = new Date().toISOString().split("T")[0];
    try {
      setLoading(true);
      const resp = await fetch("http://192.168.29.215:5010/save-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          entry,
          date,
          micro // added micro-checkin info
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        Alert.alert("Save error", data?.error || "Could not save journal.");
        return;
      }

      // Backend returns question_type, question, options
      setValidationInitialData({
        question_type: data.question_type,
        question: data.question,
        options: data.options || []
      });

      // open validation modal
      setValidationVisible(true);
    } catch (err) {
      console.error("Save journal error:", err);
      Alert.alert("Error", "Could not save journal. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // micro-checkin UI handlers
  const openEmoji = () => setMicroType('emoji') || setMicroVisible(true);
  const openTags = () => setMicroType('tags') || setMicroVisible(true);
  const openSlider = () => setMicroType('happimeter') || setMicroVisible(true);

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll
      enableOnAndroid
      extraScrollHeight={80}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      backgroundColor="#fafaf5"
    >
      <View style={styles.container}>
        {showPrivacyCard && (
          <Animated.View style={[styles.privacyCard, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.privacyTitle}>🔒 Your Privacy Matters</Text>
            <Text style={styles.privacyText}>
              Your journal is encrypted and completely private, only you can read it. ❤️
            </Text>
          </Animated.View>
        )}

        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.date}>
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        <Text style={styles.affirmation}>{affirmation}</Text>

        <View style={styles.adviceBox}>
          <Text style={styles.adviceText}>
            Take 3 deep breaths before writing. Let your mind flow freely without judgment.
          </Text>
        </View>

        <ImageBackground source={images.diaryPage} style={styles.diaryPage} imageStyle={styles.imageStyle}>
          <TextInput
            multiline
            value={entry}
            onChangeText={setEntry}
            placeholder="Start writing your thoughts here..."
            placeholderTextColor="#8B8B8B"
            style={styles.textInput}
            textAlignVertical="top"
          />
        </ImageBackground>

        <CustomButton title="Save Journal" containerStyles="mt-7" handlePress={onSavePress} />

        {loading && (
          <View style={styles.loadingOverlay}>
            <LottieView source={require('../../../assets/Animations/Sandy Loading.json')} autoPlay loop style={{ width: 200, height: 200 }} />
          </View>
        )}

        {/* Micro-checkin modals (render exactly one based on microType) */}
        <EmojiCheckIn
          visible={microVisible && microType === 'emoji'}
          onClose={() => setMicroVisible(false)}
          onSelectEmotion={(label) => handleMicroComplete('emoji', label)}
        />

        <TagsCheckIn
          visible={microVisible && microType === 'tags'}
          onClose={() => setMicroVisible(false)}
          onComplete={(tags) => handleMicroComplete('tags', tags)}
        />

        <SliderCheckin
          isVisible={microVisible && microType === 'happimeter'}
          onClose={() => setMicroVisible(false)}
          onSubmit={(val) => handleMicroComplete('happimeter', val)}
        />

        {/* Validation Modal (receives initial question data from server) */}
        <ValidationModal
          isVisible={validationVisible}
          closeModal={() => { setValidationVisible(false); setValidationInitialData(null); }}
          journalEntry={entry}
          initialQuestionData={validationInitialData}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

// -----------------------------
// Styles (kept largely same as your previous styles; minor modal style changes retained)
// -----------------------------
const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  privacyCard: { position: "absolute", top: 0, left: 0, right: 0, marginHorizontal: 20, backgroundColor: "white", padding: 16, borderRadius: 16, elevation: 5, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, zIndex: 999, marginTop:10 },
  privacyTitle: { fontSize: 17, fontFamily: "Gilroy-Bold", color: "#1a1a1a", textAlign: "center", marginBottom: 4 },
  privacyText: { fontSize: 14, fontFamily: "Gilroy-Regular", color: "#4d4d4d", textAlign: "justify", lineHeight: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  backBtn: { paddingVertical: 10, paddingHorizontal: 1 },
  backText: { fontSize: 18, fontFamily: "Gilroy-Bold" },
  date: { fontSize: 18, fontFamily: "Gilroy-Regular" },
  adviceBox: { backgroundColor: '#E8F8F5', borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#1ABC9C', elevation: 2 },
  adviceText: { fontFamily: 'Gilroy-Regular', fontSize: 15, color: '#34495E' },
  affirmation: { fontSize: 18, fontStyle: 'italic', color: '#4B4B4B', textAlign: 'center', marginBottom: 12, fontFamily: 'Gilroy-Regular' },
  diaryPage: { flex: 1, minHeight: 300, borderRadius: 16, overflow: 'hidden', padding: 20, elevation: 4, backgroundColor: '#fff' },
  imageStyle: { resizeMode: 'cover', opacity: 0.9 },
  textInput: { flex: 1, fontFamily: 'Gilroy-Regular', fontSize: 15, lineHeight: 23, color: '#333', marginTop: 6, textAlign: "justify" },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1000, backgroundColor: "rgba(255, 255, 255, 0.5)" },

  // MODAL STYLES
  modalContainer: { backgroundColor: "white", padding: 22, borderRadius: 16, alignItems: "stretch", marginTop:90 },
  modalTitle: { fontSize: 20, fontFamily: "Gilroy-Bold", marginBottom: 8, textAlign: "center" },
  modalHeading: { fontSize: 17, fontFamily: "Gilroy-Bold", marginTop: 12 },
  modalText: { fontSize: 16, fontFamily: "Gilroy-Regular", marginTop: 6, textAlign:"justify" },
  optionBtn: { padding: 12, backgroundColor: "#F2F2F2", borderRadius: 12, marginVertical: 6, alignItems: "center" },
  optionText: { fontFamily: "Gilroy-Bold", fontSize: 16, color: "#333" },
  textField: { borderWidth: 1, borderColor: "#DDD", borderRadius: 10, padding: 10, fontSize: 15, fontFamily: "Gilroy-Regular", minHeight: 80 },
  submitBtn: { marginTop: 12, padding: 12, backgroundColor: "#3c3d37", borderRadius: 12, alignItems: "center" },
  submitText: { color: "white", fontFamily: "Gilroy-Bold", fontSize: 15 },
  modalButtons: { marginTop: 16, flexDirection: "row", justifyContent: "space-between" },
  modalButton: { flex: 1, padding: 12, backgroundColor: "#1C352D", borderRadius: 12, alignItems: "center", marginHorizontal: 4,},
  modalButtonText: { color: "white", fontFamily: "Gilroy-Bold", fontSize: 15}
});
