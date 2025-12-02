// app/(tabs)/diary/index.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNavigation } from "expo-router";
import { images } from "../../../constants";
import { MotiView, AnimatePresence } from "moti";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

// Import your Lottie JSON file
import friendlyAnimation from "../../../assets/Animations/disclaimer.json";

export default function DiaryIndex() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-RegularItalic": require("../../../assets/fonts/Gilroy-RegularItalic.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#547792" />
      </SafeAreaView>
    );
  }

  useEffect(() => {
    setShowDisclaimer(true);
    const timer = setTimeout(() => setShowDisclaimer(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const triggerDisclaimer = () => {
    setShowDisclaimer(true);
    const timer = setTimeout(() => setShowDisclaimer(false), 3000);
    return () => clearTimeout(timer);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={images.diarybg}
          style={{ flex: 1 }}
          imageStyle={{ resizeMode: "cover" }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 420 }}
              style={styles.innerContainer}
            >
              <MotiView
                from={{ opacity: 0, translateY: 6 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 80, type: "timing", duration: 420 }}
                style={styles.card}
              >
                <Text style={[styles.title, { fontFamily: "Gilroy-Bold" }]}>
                  StudentSphere — Diary
                </Text>

                <View style={styles.descriptionContainer}>
                  <Text
                    style={[
                      styles.headingText,
                      { fontFamily: "Gilroy-RegularItalic" },
                    ]}
                  >
                    “Welcome to your safe space.”
                  </Text>

                  <Text
                    style={[
                      styles.bodyText,
                      { fontFamily: "Gilroy-Regular" },
                    ]}
                  >
                    This is your personal journal—where your thoughts flow
                    freely, without judgment. Write to heal, to reflect, to
                    grow. Every entry is a step towards understanding yourself
                    better.
                  </Text>

                  <Text
                    style={[
                      styles.footerText,
                      { fontFamily: "Gilroy-Bold" },
                    ]}
                  >
                    Begin your journey of self-expression.
                  </Text>
                </View>

                <View style={styles.quoteWrap}>
                  <Text
                    style={[
                      styles.quote,
                      { fontFamily: "Gilroy-RegularItalic" },
                    ]}
                  >
                    "Writing is the painting of the voice." — Voltaire
                  </Text>
                </View>

                <View style={styles.buttonsColumn}>
                  <MotiView
                    from={{ opacity: 0, translateY: 6 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 120 }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => router.push("/diary/journalentry")}
                    >
                      <LinearGradient
                        colors={["#FFCDB2", "#B5828C"]}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.primaryButton}
                      >
                        <Text
                          style={[
                            styles.primaryText,
                            { fontFamily: "Gilroy-Bold" },
                          ]}
                        >
                          Write a Journal
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </MotiView>

                  <MotiView
                    from={{ opacity: 0, translateY: 6 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 240 }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => router.push("/diary/journalview")}
                    >
                      <LinearGradient
                        colors={["#FFCDB2", "#B5828C"]}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={[styles.secondaryButton]}
                      >
                        <Text
                          style={[
                            styles.primaryText,
                            { fontFamily: "Gilroy-Bold" },
                          ]}
                        >
                          View Your Diary
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </MotiView>
                </View>
              </MotiView>
            </MotiView>
          </ScrollView>

          {/* Slide-up Disclaimer with Lottie outside the card */}
          <AnimatePresence>
  {showDisclaimer && (
    <MotiView
      from={{ translateY: 150, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: 150, opacity: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={styles.disclaimerWrapper} // parent wrapper
    >
      {/* Lottie floating above card */}
      <LottieView
        source={friendlyAnimation}
        autoPlay
        loop
        style={styles.lottieStyle}
      />

      {/* Card with text */}
      <View style={styles.disclaimerCard}>
        <Text style={[styles.disclaimerText, { fontFamily: "Gilroy-Regular" }]}>
          This app is your AI companion for mental wellness, helping you reflect and express yourself. It’s not a replacement for professional care, and reaching out for extra support is always okay. 💛
        </Text>
      </View>
    </MotiView>
  )}
</AnimatePresence>


          {/* Trigger Button (Bottom-right arrow) */}
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={triggerDisclaimer}
          >
            <Ionicons name="caret-up-outline" size={40} color="#44444E" />
          </TouchableOpacity>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fbf8ef",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  disclaimerWrapper: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 10,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimerCard: {
    backgroundColor: "rgba(255, 248, 240, 0.9)",
    padding: 12,
    borderRadius: 12,
    elevation: 5,
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  disclaimerContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 248, 240, 0.9)", // leave space for Lottie
    borderRadius: 12,
    elevation: 5,
    zIndex: 10,
    alignItems: "center",
  },

  lottieStyle: {
    width: 200,
    height: 200,
    top:40
// pull it visually above the card
  },
  disclaimerText: {
    fontSize: 15,
    color: "#333333",
    textAlign: "justify",
    lineHeight: 20,
    padding:10
  },
  title: {
    fontSize: 30,
    color: "#1f3142",
    marginBottom: 8,
    textAlign: "center",
  },
  descriptionContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  headingText: {
    fontSize: 20,
    color: "#2e4757",
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  bodyText: {
    fontSize: 17,
    lineHeight: 22,
    color: "#4a5560",
    textAlign: "justify",
    marginBottom: 8,
    padding: 6,
  },
  footerText: {
    fontSize: 18,
    color: "#2e6f95",
    marginTop: 4,
    textAlign: "center",
  },
  quoteWrap: {
    marginTop: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  quote: {
    fontSize: 15,
    color: "#6d6d6d",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  buttonsColumn: {
    marginTop: 14,
    gap: 12,
  },
  primaryButton: {
    padding: 14,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 12,
    minWidth: 260,
    alignItems: "center",
    shadowColor: "#043915",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.05,
    elevation: 5,
  },
  secondaryButton: {
    padding: 14,
    paddingHorizontal: 18,
    marginVertical: 5,
    borderRadius: 12,
    minWidth: 260,
    alignItems: "center",
    shadowColor: "#043915",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.05,
    elevation: 5,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
  },
  arrowButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 15,
  },
});
