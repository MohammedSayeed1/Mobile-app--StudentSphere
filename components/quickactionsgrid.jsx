import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

const actions = [
  { title: 'Journal',       emoji: '✍️', route: '/diary/journalentry', color: '#FDE2E4' },
  { title: 'Entries',       emoji: '📖', route: '/diary/journalview',  color: '#E2F0CB' },
  { title: 'Affirmations',  emoji: '🙏', route: '/diary/affirmations',   color: '#CDEDF6' },
  { title: 'Settings',      emoji: '⚙️', route: '/settings',            color: '#FFF1C1' },
];

const QuickActionsGrid = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-RegularItalic": require("../assets/fonts/Gilroy-RegularItalic.ttf"),
  });

  // Prevent rendering until fonts are loaded
  if (!fontsLoaded) return null;

  return (
    <View className="flex flex-wrap flex-row px-4 py-2 justify-between">
      {actions.map((action, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100 }}
          style={{
            width: "48%",
            backgroundColor: action.color,
            borderRadius: 20,
            padding: 16,
            marginBottom: 12,
            shadowColor: "#111",
            shadowOpacity: 0.5,
            shadowRadius: 8,
            shadowOffset: { width: 5, height: 8 },
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (typeof action.route === 'string') {
                router.push(action.route);
              } else {
                router.push({
                  pathname: action.route.pathname,
                  params: action.route.params,
                });
              }
            }}
          >
            <Text style={{ fontSize: 25, marginBottom: 6 }}>{action.emoji}</Text>

            <Text
              style={{
                fontSize: 18,
                color: "#333",
                fontFamily: "Gilroy-Bold",
              }}
            >
              {action.title}
            </Text>
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  );
};

export default QuickActionsGrid;
