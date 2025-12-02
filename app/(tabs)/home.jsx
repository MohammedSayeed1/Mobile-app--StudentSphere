import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import axios from 'axios';
import { useFonts } from 'expo-font';

import QuickActionsGrid from '../../components/quickactionsgrid';
import StreakCalendar from '../../components/streakcalender';
import MoodSnapshot from '../../components/moodsnapshot';

// =============================
// Greeting Component
// =============================
const SimpleGreeting = () => {
  const [username, setUsername] = useState('');
  const [greeting, setGreeting] = useState('Hey');

  // Load Gilroy Fonts
  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require('../../assets/fonts/Gilroy-Regular.ttf'),
    "Gilroy-Bold": require('../../assets/fonts/Gilroy-Bold.ttf'),
    "Gilroy-RegularItalic": require('../../assets/fonts/Gilroy-RegularItalic.ttf'),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) Backwards compatibility: check if a plain 'username' key exists
        let storedName = await AsyncStorage.getItem('username');

        // 2) If not found, try the 'user' object (newer approach)
        if (!storedName) {
          const rawUser = await AsyncStorage.getItem('user');
          if (rawUser) {
            try {
              const parsed = JSON.parse(rawUser);
              // parsed might be { username, email } — handle safely
              storedName = parsed?.username ?? parsed?.name ?? null;
            } catch (err) {
              // if parsing fails, fallback to using rawUser as string
              storedName = rawUser;
            }
          }
        }

        // Normalize/trim and fallback
        const finalName = (storedName && storedName !== 'null') ? String(storedName).trim() : '';

        setUsername(finalName || 'Friend');

        // Greeting based on hour
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning!');
        else if (hour < 17) setGreeting('Good Afternoon!');
        else if (hour < 21) setGreeting('Good Evening!');
        else setGreeting('Good Night!');
      } catch (err) {
        console.warn('Error loading username from storage:', err);
        setUsername('Friend');
      }
    };

    loadData();
  }, []);

  // Wait for font load
  if (!fontsLoaded) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 900 }}
      className="px-6 pt-6"
    >
      <Text
        className="mb-1 text-gray-800"
        style={{ fontFamily: 'Gilroy-Bold', fontSize: 24 }}
      >
        {greeting},
      </Text>

      <Text
        className="text-black-600"
        style={{ fontFamily: 'Gilroy-RegularItalic', fontSize: 18 }}
      >
        {username}
      </Text>

      <Text
        className="text-gray-500 mt-2"
        style={{ fontFamily: 'Gilroy-RegularItalic', fontSize: 14 }}
      >
        Hope today brings clarity and calm ✨
      </Text>
    </MotiView>
  );
};

// =============================
// HOME SCREEN EXPORT
// =============================
export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FBF8EF" }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          backgroundColor: "#FBF8EF",
        }}
      >
        <SimpleGreeting />
        <MoodSnapshot />
        <QuickActionsGrid />
        <StreakCalendar />
      </ScrollView>
    </View>
  );
}
