import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import { useFonts } from "expo-font";
import Animated, { FadeInRight, Layout } from "react-native-reanimated";
import CardBg from "../../../../assets/images/journalviewbgcard.jpg";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;

const monthNameToNumber = (monthName) => {
  const map = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
  };
  return map[monthName] || 0;
};

const readUsername = async () => {
  try {
    let username = await AsyncStorage.getItem("username");
    if (!username) {
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        try { username = JSON.parse(raw)?.username ?? JSON.parse(raw)?.name ?? null; }
        catch { username = raw; }
      }
    }
    if (username && username !== "null") return String(username).trim();
    return null;
  } catch { return null; }
};

const ViewMonth = () => {
  const params = useLocalSearchParams();
  const { month, year } = params;

  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../../assets/fonts/Gilroy-Bold.ttf"),
  });

  useEffect(() => {
    const fetchJournals = async () => {
      const username = await readUsername();
      if (!username) return;

      const monthNumber = monthNameToNumber(month);
      const datePrefix = `${year}-${monthNumber.toString().padStart(2, "0")}`;

      try {
        const res = await fetch(
          `http://192.168.29.215:5010/get-journal?username=${username}&datePrefix=${datePrefix}`
        );
        const json = await res.json();
        setJournals(json.entries || []);
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [month, year]);

  if (!fontsLoaded) return null;
  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (journals.length === 0)
    return (
      <View style={styles.noData}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { marginBottom: 20 }]}>Your Journals</Text>
        <Text>No Journals Found for {month} {year}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Journals</Text>

      <FlatList
        data={journals}
        horizontal
        keyExtractor={(item) => item.date}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInRight.duration(300 + index * 120)}
            layout={Layout}
            style={styles.cardContainer}
          >
            <ImageBackground
              source={CardBg}
              style={styles.card}
              imageStyle={{ borderRadius: 16 }}
            >
              <Text style={styles.date}>{item.date}</Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                style={{ flex: 1 }}
              >
                <Text style={styles.text}>{item.text}</Text>
              </ScrollView>
            </ImageBackground>
          </Animated.View>
        )}
      />
    </View>
  );
};

export default ViewMonth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    paddingTop: 70,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 20,
  },

  cardContainer: {
    width: CARD_WIDTH,
    height: height * 0.6,
  },

  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 20,
  },

  backText: {
    fontSize: 18,
    color: "#1A2A4F",
    fontFamily: "Gilroy-Bold",
  },

  date: {
    fontFamily: "Gilroy-Bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    color: "#4f46e5",
  },

  text: {
    fontFamily: "Gilroy-Regular",
    fontSize: 15,
    color: "#111",
    textAlign: "justify",
  },

  noData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
