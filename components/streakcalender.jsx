import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { useFonts } from "expo-font";
import { useFocusEffect } from "@react-navigation/native";

// -------- Read Username (Stable) --------
const readUsername = async () => {
  try {
    let username = await AsyncStorage.getItem("username");

    if (!username) {
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          username = parsed?.username ?? parsed?.name ?? null;
        } catch (err) {
          username = raw;
        }
      }
    }

    return username && username !== "null"
      ? String(username).trim()
      : null;
  } catch (err) {
    console.warn("Error reading username:", err);
    return null;
  }
};

// Sentiment → Emoji map
const sentimentEmojiMap = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  angry: "😡",
  grateful: "🙏",
  hopeful: "🌈",
  stressed: "😩",
  lonely: "😔",
  guilty: "😓",
  conflicted: "🤯",
};

const positiveSentiments = new Set(["happy", "grateful", "hopeful"]);

const StreakCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-RegularItalic": require("../assets/fonts/Gilroy-RegularItalic.ttf"),
  });

  const today = dayjs().format("YYYY-MM-DD");

  // -----------------------------------------
  // ⭐ FETCH CALENDAR DATA (FINAL WORKING VERSION)
  // -----------------------------------------
  const fetchJournalSentiments = async () => {
    try {
      setLoading(true);

      const username = await readUsername();

      if (!username) {
        setMarkedDates({});
        setStreak(0);
        return;
      }

      const res = await axios.post(
        "http://192.168.29.215:5010/affirmations",
        { username }
      );

      

      // Extract journal entries safely
      const journals = Array.isArray(res.data.journals)
        ? res.data.journals
        : [];

      const dateSentimentMap = {};

      journals.forEach((entry) => {
        const rawDate =
          entry.date ??
          entry.timestamp ??
          entry.createdAt ??
          entry.dateString ??
          null;

        const dateStr =
          rawDate && dayjs(rawDate).isValid()
            ? dayjs(rawDate).format("YYYY-MM-DD")
            : null;

        let sentimentRaw =
          entry.sentiment ||
          entry.sentiment_label ||
          entry.sentimentText ||
          entry.sentimentType;

        const sentiment = sentimentRaw
          ? String(sentimentRaw).trim().toLowerCase()
          : null;

        if (dateStr && sentiment) {
          dateSentimentMap[dateStr] = sentiment;
        }
      });

      // Prepare markings for calendar
      const markings = {};

      Object.entries(dateSentimentMap).forEach(([dateStr, sentiment]) => {
        const emoji = sentimentEmojiMap[sentiment] || null;

        markings[dateStr] = {
          marked: !!emoji,
          emoji,
          customStyles: {
            container: {
              backgroundColor: emoji
                ? "rgba(255, 235, 230, 0.55)"
                : "transparent",
              borderRadius: 12,
            },
            text: {
              fontFamily: "Gilroy-Bold",
              color: "#222",
            },
          },
        };
      });

      // STREAK CALCULATION
      let streakCount = 0;
      let cursor = dayjs(today);

      for (let i = 0; i < 365; i++) {
        const d = cursor.format("YYYY-MM-DD");
        const s = dateSentimentMap[d];

        if (s && positiveSentiments.has(s)) {
          streakCount++;
          cursor = cursor.subtract(1, "day");
        } else break;
      }

      setMarkedDates(markings);
      setStreak(streakCount);
    } catch (err) {
      console.error("🔥 Calendar fetch error:", err);
      setMarkedDates({});
      setStreak(0);
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh when screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchJournalSentiments();
    }, [])
  );

  // Refresh when app becomes active
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") fetchJournalSentiments();
    });
    return () => sub.remove();
  }, []);

  // Initial load
  useEffect(() => {
    fetchJournalSentiments();
  }, []);

  // LOADING UI
  if (!fontsLoaded || loading) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0f6cff" />
        <Text
          style={{
            marginTop: 8,
            fontFamily: "Gilroy-Regular",
            color: "#556",
          }}
        >
          Loading calendar...
        </Text>
      </View>
    );
  }

  // -----------------------------------------
  // FINAL UI RENDER
  // -----------------------------------------
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 12, marginBottom: 28 }}>
      <Text
        style={{
          fontFamily: "Gilroy-Bold",
          fontSize: 22,
          color: "#223",
        }}
      >
        Mood Calendar
      </Text>

      <Text
        style={{
          fontFamily: "Gilroy-Regular",
          fontSize: 14,
          color: "#556",
          marginBottom: 8,
        }}
      >
        Track how you felt each day — emojis show your mood at a glance.
      </Text>

      <Calendar
        markingType="custom"
        markedDates={markedDates}
        theme={{
          calendarBackground: "#fafaf5",
          textDayFontFamily: "Gilroy-Regular",
          textMonthFontFamily: "Gilroy-Bold",
          textDayHeaderFontFamily: "Gilroy-Bold",
          textDayFontSize: 16,
          textDayHeaderFontSize: 14,
          textMonthFontSize: 20,
          monthTextColor: "#263238",
          arrowColor: "#263238",
        }}
        dayComponent={({ date, state }) => {
          const mark = markedDates[date.dateString];
          const emoji = mark?.emoji;
          const isToday = date.dateString === today;

          return (
            <View
              style={{
                height: 48,
                width: 48,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: emoji
                  ? "rgba(255, 235, 230, 0.55)"
                  : isToday
                  ? "rgba(200, 225, 255, 0.45)"
                  : "transparent",
              }}
            >
              {emoji && (
                <Text
                  style={{
                    position: "absolute",
                    fontSize: 28,
                    opacity: 0.6,
                    transform: [{ translateY: -2 }],
                  }}
                >
                  {emoji}
                </Text>
              )}

              <Text
                style={{
                  fontFamily: "Gilroy-Bold",
                  fontSize: 14,
                  color: state === "disabled" ? "#C8C8C8" : "#222",
                }}
              >
                {date.day}
              </Text>
            </View>
          );
        }}
      />

      {/* Legend */}
      <View
        style={{
          marginTop: 14,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 5,
        }}
      >
        {Object.entries(sentimentEmojiMap).map(([sentiment, emoji]) => (
          <View
            key={sentiment}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 14,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 6 }}>{emoji}</Text>
            <Text
              style={{
                fontFamily: "Gilroy-Regular",
                fontSize: 13,
                color: "#475",
              }}
            >
              {sentiment}
            </Text>
          </View>
        ))}
      </View>

      {/* STREAK CARD */}
      <View
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontFamily: "Gilroy-Bold",
            fontSize: 18,
            color: "#223",
          }}
        >
          Current Positive Streak
        </Text>

        <Text
          style={{
            fontFamily: "Gilroy-Bold",
            fontSize: 20,
            color: "#16A34A",
            marginTop: 6,
          }}
        >
          {streak} Day{streak !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
};

export default StreakCalendar;
