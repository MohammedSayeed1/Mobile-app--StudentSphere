import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MotiView } from 'moti';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router } from "expo-router";

const MoodSnapshot = () => {
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Gilroy fonts
  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-RegularItalic": require("../assets/fonts/Gilroy-RegularItalic.ttf"),
  });

  // Helper to read username (compatibility: 'username' key or 'user' object)
  const readUsername = async () => {
    try {
      let username = await AsyncStorage.getItem('username');

      if (!username) {
        const raw = await AsyncStorage.getItem('user');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            username = parsed?.username ?? parsed?.name ?? null;
          } catch (err) {
            // If parsing fails but raw is a string username, use it
            username = raw;
          }
        }
      }

      // Normalize
      if (username && username !== 'null') return String(username).trim();
      return null;
    } catch (err) {
      console.warn("Error reading username from storage:", err);
      return null;
    }
  };

  // ---------------------------
  // 🔥 Fetch Latest Mood
  // ---------------------------
  const fetchMood = async () => {
    setLoading(true);
    try {
      const username = await readUsername();

      if (!username) {
        // no username: ensure we stop loading and set mood null
        setMood(null);
        return;
      }

      // Call backend with username
      const res = await axios.post('http://192.168.29.215:5010/affirmations', { username });

      // Backend expected shape: { journals: [...] } - handle safely
      const entries = res?.data?.journals ?? [];

      if (!Array.isArray(entries) || entries.length === 0) {
        setMood(null);
        return;
      }

      const latest = entries
        .slice()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      setMood({
        sentiment: latest.sentiment || 'Neutral',
        text: latest.text || '',
        affirmation: latest.affirmation || '',
      });
    } catch (err) {
      console.error('Error fetching mood:', err);
      setMood(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 🔄 Refresh when screen gains focus
  // ---------------------------
  useFocusEffect(
    useCallback(() => {
      fetchMood();
    }, [])
  );

  // ---------------------------
  // 🔄 Refresh when app returns from background
  // ---------------------------
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        fetchMood();
      }
    });

    return () => subscription.remove();
  }, []);

  // ---------------------------
  // ⏳ Don't render until fonts load or fetch completes
  // ---------------------------
  if (!fontsLoaded || loading) {
    return <ActivityIndicator style={{ marginTop: 24 }} color="#999" size="large" />;
  }

  // ---------------------------
  // If no mood found
  // ---------------------------
  if (!mood) {
    return (
      <View className="px-6 py-4 bg-slate-100 rounded-xl mx-4 my-2">
        <Text className="text-slate-800 text-base font-medium" style={{ fontFamily: "Gilroy-Regular" }}>
          No recent mood found.
        </Text>
      </View>
    );
  }

  const sentimentStyles = {
    Happy: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      emoji: "😊",
    },
    Sad: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      emoji: "😢",
    },
    Anxious: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      emoji: "😰",
    },
    Stressed: {
      bg: "bg-gray-200",
      text: "text-gray-700",
      emoji: "😩",
    },
    Angry: {
      bg: "bg-red-100",
      text: "text-red-800",
      emoji: "😡",
    },
    Lonely: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      emoji: "😔",
    },
    Grateful: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      emoji: "🙏",
    },
    Hopeful: {
      bg: "bg-pink-100",
      text: "text-pink-800",
      emoji: "🌈",
    },
    Guilty: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      emoji: "😓",
    },
    Conflicted: {
      bg: "bg-slate-100",
      text: "text-slate-800",
      emoji: "🤯",
    },
  };
  

  const style = sentimentStyles[mood.sentiment] || sentimentStyles['Neutral'];

  // Trim journal preview
  const trimmedText =
    mood.text.length > 150 ? mood.text.substring(0, 150) + '...' : mood.text;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 300 }}
      className={`rounded-2xl p-5 mx-4 my-2 ${style.bg}`}
    >
      {/* Sentiment Row */}
      <View className="flex-row items-center mb-2">
        <Text className="text-3xl mr-2">{style.emoji}</Text>

        <Text
          className={`text-xl font-bold ${style.text}`}
          style={{ fontFamily: "Gilroy-Bold" }}
        >
          {mood.sentiment}
        </Text>
      </View>

      {/* Journal text preview */}
      <Text
        className={`text-base mb-2 ${style.text}`}
        style={{ fontFamily: "Gilroy-Regular", textAlign: "justify" }}
      >
        {trimmedText}
      </Text>

      {/* Continue journaling */}
      <TouchableOpacity onPress={() => router.push('/diary/journalentry')} className="mt-1">
        <Text
          className="text-indigo-600 font-semibold"
          style={{ fontFamily: "Gilroy-Bold" }}
        >
          Continue journaling →
        </Text>
      </TouchableOpacity>

      {/* Affirmation */}
      <Text
        className="text-sm text-gray-500 mt-2"
        style={{ fontFamily: "Gilroy-RegularItalic" }}
      >
        "{mood.affirmation}"
      </Text>
    </MotiView>
  );
};

export default MoodSnapshot;
