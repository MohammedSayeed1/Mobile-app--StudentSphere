import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import MonthCard from "./MonthCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.88, 360);

export default function MonthCardStack({ coverImage }) {
  const [months, setMonths] = useState([]); // array of { month, summary, entries }
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0); // 0 = cover, 1..n = months
  const translate = useSharedValue(0);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-RegularItalic": require("../assets/fonts/Gilroy-RegularItalic.ttf"),
  });

  // fetch monthly summary from backend
  const load = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      if (!username) {
        Alert.alert("Not logged in", "Please sign in first.");
        setLoading(false);
        return;
      }

      const resp = await fetch(
        `http://127.0.0.1:5010/get-monthly-summary?username=${encodeURIComponent(
          username
        )}`
      );
      const data = await resp.json();

      // expected: { start_month: "...", months: [{month, summary, entries}, ...] }
      if (!resp.ok) {
        console.warn("Monthly summary error:", data);
        setMonths([]);
      } else {
        const serverMonths = data.months || [];
        // Build display array: first element is the cover
        setMonths(serverMonths);
      }
    } catch (err) {
      console.error("Failed to fetch monthly summary:", err);
      setMonths([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // whenever index changes animate container translate
  useEffect(() => {
    translate.value = withTiming(-index * (CARD_WIDTH + 16), { duration: 420 });
  }, [index]);

  // animated style for slider container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translate.value },
      ],
    };
  });

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#547792" />
        <Text style={{ marginTop: 10, fontFamily: "Gilroy-Regular" }}>
          Loading...
        </Text>
      </View>
    );
  }

  // full list: cover + months
  const items = [
    { isCover: true, month: "Welcome", summary: "", entries: 0 },
    ...months,
  ];

  const goNext = () => {
    if (index < items.length - 1) setIndex((s) => s + 1);
  };
  const goPrev = () => {
    if (index > 0) setIndex((s) => s - 1);
  };

  const onViewJournals = (monthLabel) => {
    // navigate to monthly detail screen (you need to implement)
    // we push route with month param. Example: /diary/month?month=November%202025
    const encoded = encodeURIComponent(monthLabel);
    router.push(`/diary/month?month=${encoded}`);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.viewport}>
        <Animated.View style={[styles.slider, animatedStyle]}>
          {items.map((it, i) => (
            <View key={`${it.month}-${i}`} style={styles.cardWrap}>
              <MonthCard
                isCover={it.isCover}
                coverImage={coverImage}
                month={it.month}
                summary={it.summary}
                onViewJournals={() => onViewJournals(it.month)}
                indexLabel={it.isCover ? "" : `${i} / ${items.length - 1}`}
                fontFamilies={{
                  regular: "Gilroy-Regular",
                  bold: "Gilroy-Bold",
                  regularItalic: "Gilroy-RegularItalic",
                }}
              />
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={goPrev}
          style={[styles.ctrlBtn, index === 0 && styles.disabledBtn]}
          disabled={index === 0}
        >
          <Text style={[styles.ctrlText, index === 0 && { opacity: 0.35 }]}>
            ← Prev
          </Text>
        </TouchableOpacity>

        <Text style={[styles.pageIndicator, { fontFamily: "Gilroy-Regular" }]}>
          {index === 0 ? "Cover" : `Month ${index} / ${items.length - 1}`}
        </Text>

        <TouchableOpacity
          onPress={goNext}
          style={[
            styles.ctrlBtn,
            index === items.length - 1 && styles.disabledBtn,
          ]}
          disabled={index === items.length - 1}
        >
          <Text
            style={[
              styles.ctrlText,
              index === items.length - 1 && { opacity: 0.35 },
            ]}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 24,
  },
  viewport: {
    width: CARD_WIDTH,
    height: 480,
    overflow: "hidden",
  },
  slider: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardWrap: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  controls: {
    marginTop: 18,
    width: CARD_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctrlBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: "#fafafa",
  },
  ctrlText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Gilroy-Bold",
  },
  pageIndicator: {
    fontSize: 14,
    color: "#555",
  },
  loaderWrap: {
    height: 520,
    justifyContent: "center",
    alignItems: "center",
  },
});
