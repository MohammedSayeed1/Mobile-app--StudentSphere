import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

import meditationimg from "../../../assets/images/calmCatcherlogo.jpg";
import calmquest from "../../../assets/images/calm-quest.jpg";
import focusdash from "../../../assets/images/focusdash.jpg";
import memoryBloom from "../../../assets/images/memoryBloom.jpg";
import gratitudeGarden from "../../../assets/images/gratitudeGarden.jpg";
import stressBuster from "../../../assets/images/stressBuster.jpg";

const screenWidth = Dimensions.get("window").width;

const games = [
  {
    id: 1,
    title: "Click the fruit!",
    description: "Click the fruits to get points and avoid Bombs!",
    image: meditationimg,
    color: "#D6F4ED",
  },
  {
    id: 2,
    title: "Calm Quest",
    description:
      "Practice relaxation techniques by completing breathing exercises.",
    image: calmquest,
    color: "#E3F4FF",
  },
  {
    id: 3,
    title: "Focus Dash",
    description:
      "Improve your concentration with engaging mini puzzles.",
    image: focusdash,
    color: "#E8F8E3",
  },
  {
    id: 4,
    title: "Memory Bloom",
    description:
      "Train your brain with memory-based challenges.",
    image: memoryBloom,
    color: "#FFF0F5",
  },
  {
    id: 5,
    title: "Gratitude Garden",
    description:
      "Grow your virtual garden through gratitude reflections.",
    image: gratitudeGarden,
    color: "#FFFACD",
  },
  {
    id: 6,
    title: "Stress Buster",
    description:
      "Relieve tension with guided interactive sessions.",
    image: stressBuster,
    color: "#E0FFFF",
  },
];

const GamesScreen = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../assets/fonts/Gilroy-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  const handlePress = (id, title) => {
    switch (id) {
      case 1:
        router.push("/Games/calmCatcher");
        break;
      case 2:
        router.push("/Games/calm-quest");
        break;
      case 3:
        router.push("/Games/focusdash");
        break;
      default:
        alert(`${title} is coming soon!`);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Mindful Games</Text>

      {/* Wrapper fixes the left spacing issue */}
      <View style={styles.cardsWrapper}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.card, { backgroundColor: game.color }]}
            onPress={() => handlePress(game.id, game.title)}
          >
            <Image source={game.image} style={styles.image} resizeMode="cover" />

            <View style={styles.textContainer}>
              <Text style={styles.title}>{game.title}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {game.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFE9E3",
    paddingTop: 10,
  },

  // Fix: Only this wrapper has padding, not the ScrollView
  cardsWrapper: {
    paddingHorizontal: 16,
  },

  header: {
    fontSize: 22,
    color: "#313647",
    fontWeight: "700",
    marginVertical: 16,
    textAlign: "center",
    fontFamily: "Gilroy-Bold",
  },

  card: {
    flexDirection: "row",
    borderRadius: 16,
    marginBottom: 16,
    width: "100%",
    overflow: "hidden",

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: screenWidth * 0.28, // image perfectly left-aligned
    height: 110,
  },

  textContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
    color: "#1A2A4F",
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Gilroy-Regular",
    color: "#1A2A4F",
  },
});

export default GamesScreen;
