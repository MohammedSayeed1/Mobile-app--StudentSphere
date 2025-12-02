import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeInDown,
  ZoomIn,
  Layout,
} from "react-native-reanimated";
import CardStack from "../../../components/animations/CardStack";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

/* 🟩 ADDED — Read Username from AsyncStorage */
const readUsername = async () => {
  try {
    let username = await AsyncStorage.getItem("username");
    if (!username) {
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        try {
          username =
            JSON.parse(raw)?.username ?? JSON.parse(raw)?.name ?? null;
        } catch {
          username = raw;
        }
      }
    }
    if (username && username !== "null") return String(username).trim();
    return null;
  } catch {
    return null;
  }
};

const JournalView = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2025);

  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState(null);

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../assets/fonts/Gilroy-Bold.ttf"),
  });

  // 🟦 Load username first
  useEffect(() => {
    const loadUser = async () => {
      const name = await readUsername();
      setUsername(name);
    };
    loadUser();
  }, []);

  // 🟦 Fetch Summaries After Username Loads
  useEffect(() => {
    if (!username) return;

    const loadData = async () => {
      try {
        const res = await fetch(`http://192.168.29.215:5010/summaries/${username}`);
        const json = await res.json();
        setSummaries(json?.summaries || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  // 🟩 Filter based on selected year
  const yearCards = summaries
    .filter((item) => item.year === selectedYear)
    .map((item) => ({
      month: item.month,
      year: item.year,
      summary: item.summary,
    }));

  const renderYearCard = ({ item }) => {
    const isActive = item === selectedYear;

    return (
      <TouchableOpacity onPress={() => setSelectedYear(item)} activeOpacity={0.8}>
        <Animated.View entering={FadeInRight.duration(300)} layout={Layout}>
          <Animated.View
            style={[styles.yearCard, isActive && styles.yearCardActive]}
          >
            <Text style={[styles.yearText, isActive && styles.yearTextActive]}>
              {item}
            </Text>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded || loading) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Animated.Text entering={FadeInDown.duration(500)} style={styles.title}>
        StudentSphere - Diary
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(150).duration(500)}
        style={styles.subtitle}
      >
        Welcome to your safe space!
      </Animated.Text>

      <View style={styles.carouselContainer}>
        <FlatList
          data={YEARS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toString()}
          renderItem={renderYearCard}
          contentContainerStyle={styles.carouselContent}
          snapToInterval={100}
          decelerationRate="fast"
        />
      </View>

      {yearCards.length === 0 ? (
        <View style={styles.noDataContainer}>
          <LottieView
            source={require("../../../assets/Animations/Reading Book.json")}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
          />
          <Text style={styles.noDataText}>No Journal Data Found</Text>
        </View>
      ) : (
        <Animated.View
          entering={ZoomIn.duration(600)}
          layout={Layout}
          style={styles.stackContainer}
        >
          <CardStack
            cards={yearCards}
            onViewJournals={(card) =>
              router.push(`/diary/${card.year}/${card.month}`)
            }
          />
        </Animated.View>
      )}
    </View>
  );
};

export default JournalView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "#fdfdfd",
    alignItems: "center",
  },

  backBtn: { position: "absolute", top: 50, left: 20 },
  backText: { fontSize: 18, color: "#1A2A4F", fontFamily: "Gilroy-Bold" },

  title: { fontSize: 30, color: "#222", fontFamily: "Gilroy-Bold" },
  subtitle: {
    fontSize: 20,
    marginTop: 4,
    color: "#666",
    marginBottom: 20,
    fontFamily: "Gilroy-Regular",
  },

  carouselContainer: { marginTop: 10, height: 90 },
  carouselContent: { paddingHorizontal: 20 },

  yearCard: {
    width: 100,
    height: 60,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 0.9 }],
  },
  yearCardActive: { backgroundColor: "#4f46e5", transform: [{ scale: 1.05 }] },
  yearText: { fontSize: 18, color: "#555", fontFamily: "Gilroy-Bold" },
  yearTextActive: { color: "#fff" },

  stackContainer: { marginTop: 30 },

  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#555",
    textAlign: "center",
  },
});
