import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { images } from 'constants';
import CustomButton from '../../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { useFonts } from "expo-font";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';

const affirmations = [
  "I am enough just as I am.",
  "I choose peace over worry.",
  "Today is full of endless possibilities.",
  "I am growing and learning every day.",
  "My thoughts become my reality.",
  "I deserve love, success, and happiness.",
  "I let go of what I can’t control.",
  "I am proud of how far I’ve come."
];

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

export default function JournalEntry() {

  const [entry, setEntry] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [affirmation] = useState(affirmations[Math.floor(Math.random() * affirmations.length)]);
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ sentiment: '', ai_affirmation: '', ai_advice: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-RegularItalic": require("../../../assets/fonts/Gilroy-RegularItalic.ttf"),
  });

  if (!fontsLoaded) return null;

  useEffect(() => {
    const init = async () => {
      const cleanUsername = await readUsername();
      if (!cleanUsername) return;

      setUsername(cleanUsername);

      const date = new Date().toISOString().split('T')[0];
      try {
        const resp = await fetch(
          `http://192.168.29.215:5010/get-journal?username=${cleanUsername}&date=${date}`
        );
        
        const data = await resp.json();
        if (resp.ok) setEntry(data.text || "");
      } catch (error) {
        console.error("Fetch journal error:", error);
      }
    };
    init();
  }, []);

  if (!fontsLoaded) return null;

  // --------------------------------------------------
  // ORIGINAL SAVE JOURNAL — no toast logic
  // --------------------------------------------------
  const saveJournal = async (navigateAfter = null) => {
    try {
      const cleanUsername = await readUsername();
      if (!cleanUsername) {
        Alert.alert("Error", "Username missing. Please log in again.");
        return;
      }
  
      setLoading(true);
  
      const response = await fetch("http://192.168.29.215:5010/save-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername, entry }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setModalData({
          sentiment: data.sentiment,
          ai_affirmation: data.ai_affirmation,
          ai_advice: data.ai_advice,
        });
  
        setTimeout(() => setLoading(false), 300);
        setModalVisible(true);
  
      } else {
        setLoading(false);
        Alert.alert("Error", data.message || "Could not save journal.");
      }
  
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Network/server issue");
      console.log(error);
    }
  };
  

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

        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.date}>
            {currentTime.toLocaleDateString()}{" "}
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* AFFIRMATION */}
        <Text style={styles.affirmation}>{affirmation}</Text>

        <View style={styles.adviceBox}>
          <Text style={styles.adviceText}>
            Take 3 deep breaths before writing. Let your mind flow freely without judgment.
          </Text>
        </View>

        {/* DIARY PAGE */}
        <ImageBackground
          source={images.diaryPage}
          style={styles.diaryPage}
          imageStyle={styles.imageStyle}
        >
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

        <CustomButton
          title="Save Journal"
          containerStyles="mt-7"
          handlePress={() => saveJournal()}
        />

        {/* LOADING */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <LottieView
              source={require('../../../assets/Animations/Sandy Loading.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}

        {/* MODAL */}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          animationIn="zoomIn"
          animationOut="zoomOut"
          backdropOpacity={0.4}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>📝 Journal Saved!</Text>

            <Text style={styles.modalHeading}>🧠 Sentiment</Text>
            <Text style={styles.modalText}>{modalData.sentiment}</Text>

            <Text style={styles.modalHeading}>💬 Affirmation</Text>
            <Text style={styles.modalText}>"{modalData.ai_affirmation}"</Text>

            <Text style={styles.modalHeading}>🌿 Advice</Text>
            <Text style={styles.modalText}>{modalData.ai_advice}</Text>

            <View style={styles.modalButtons}>

              {/* Continue Writing */}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Continue Writing</Text>
              </TouchableOpacity>

              {/* Go to Diary */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#3c3d37" }]}
                onPress={() => {
                  setModalVisible(false);
                  router.push('/diary');
                }}
              >
                <Text style={styles.modalButtonText}>Go to Diary</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  backBtn: { paddingVertical: 10, paddingHorizontal: 1 },
  backText: { fontSize: 18, fontFamily: "Gilroy-Bold" },
  date: { fontSize: 18, fontFamily: "Gilroy-Regular" },

  adviceBox: {
    backgroundColor: '#E8F8F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1ABC9C',
    elevation: 2
  },
  adviceText: {
    fontFamily: 'Gilroy-Regular',
    fontSize: 15,
    color: '#34495E',
  },

  affirmation: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#4B4B4B',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Gilroy-Regular',
  },

  diaryPage: {
    flex: 1,
    minHeight: 300,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
    elevation: 4,
    backgroundColor: '#fff',
  },
  imageStyle: { resizeMode: 'cover', opacity: 0.9 },

  textInput: {
    flex: 1,
    fontFamily: 'Gilroy-Regular',
    fontSize: 15,
    lineHeight: 23,
    color: '#333',
    marginTop: 6,
    textAlign: "justify"
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    color: '#2C3E50',
    marginTop: 10,
  },
  modalText: {
    fontSize: 15,
    fontFamily: 'Gilroy-Regular',
    color: '#34495E',
    marginBottom: 8,
    textAlign: "justify"
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#3c3d37',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: { color: 'white', fontFamily: 'Gilroy-Bold', fontSize: 15 },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.5)" // 50% opacity white
  },
});
