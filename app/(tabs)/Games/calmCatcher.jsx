import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";
import { Easing } from "react-native";
import { useRouter } from "expo-router"; // 🔹 Import router for navigation
import { Ionicons } from "@expo/vector-icons"; // 🔹 For the back arrow icon

const { width, height } = Dimensions.get("window");

const positiveIcons = [
  require("../../../assets/images/positive1.png"),
  require("../../../assets/images/positive2.png"),
  require("../../../assets/images/positive3.png"),
];
const negativeIcons = [
  require("../../../assets/images/negative.png"),
  require("../../../assets/images/negative.png"),
  require("../../../assets/images/negative.png"),
  require("../../../assets/images/negative.png"),
];

// 🎵 Sound files
const popSoundFile = require("../../../assets/sounds/pop.mp3");
const alertSoundFile = require("../../../assets/sounds/alert.mp3");
const bgMusicFile = require("../../../assets/sounds/calmCatcherBG.mp3");

// 🎮 Game constants
const SPAWN_INTERVAL = 1000;
const GAME_DURATION = 120;
const MAX_ACTIVE = 12;
const ICON_SIZE = 60;

export default function CalmCatcher() {
  const router = useRouter(); // 🔹 Initialize router

  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [icons, setIcons] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const spawnIntervalRef = useRef(null);
  const timerRef = useRef(null);
  const popSound = useRef(null);
  const alertSound = useRef(null);
  const bgMusic = useRef(null);

  // 🎵 Load sounds
  useEffect(() => {
    (async () => {
      try {
        const [pop, alert] = await Promise.all([
          Audio.Sound.createAsync(popSoundFile),
          Audio.Sound.createAsync(alertSoundFile),
        ]);
        popSound.current = pop.sound;
        alertSound.current = alert.sound;
      } catch (error) {
        console.warn("Error loading sounds:", error);
      }
    })();

    return () => {
      clearInterval(spawnIntervalRef.current);
      clearTimeout(timerRef.current);
      unloadAllSounds();
    };
  }, []);

  const unloadAllSounds = async () => {
    if (popSound.current) await popSound.current.unloadAsync();
    if (alertSound.current) await alertSound.current.unloadAsync();
    if (bgMusic.current) await bgMusic.current.unloadAsync();
  };

  // 🕒 Timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && gameStarted) {
      endGame();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted]);

  const startGame = async () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIcons([]);
    startSpawning();

    try {
      if (bgMusic.current) await bgMusic.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(bgMusicFile, {
        shouldPlay: true,
        isLooping: true,
        volume: 0.6,
      });
      bgMusic.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.warn("Error playing background music:", error);
    }
  };

  const endGame = async () => {
    setGameStarted(false);
    setGameOver(true);
    clearInterval(spawnIntervalRef.current);
    try {
      if (bgMusic.current) await bgMusic.current.stopAsync();
    } catch (error) {
      console.warn("Error stopping background music:", error);
    }
  };

  // 🎯 Spawn logic
  const startSpawning = () => {
    clearInterval(spawnIntervalRef.current);
    spawnIntervalRef.current = setInterval(() => {
      setIcons((prev) => {
        if (prev.length >= MAX_ACTIVE) return prev;
        const icon = createIcon();
        animateIcon(icon);
        return [...prev, icon];
      });
    }, SPAWN_INTERVAL);
  };

  const createIcon = () => {
    const isPositive = Math.random() > 0.45;
    const imageArray = isPositive ? positiveIcons : negativeIcons;
    const img = imageArray[Math.floor(Math.random() * imageArray.length)];
    const startX = width * (0.15 + Math.random() * 0.7);
    const startY = height + 80;

    const x = new Animated.Value(startX);
    const y = new Animated.Value(startY);
    const current = { x: startX, y: startY };

    const xListener = x.addListener(({ value }) => (current.x = value));
    const yListener = y.addListener(({ value }) => (current.y = value));

    return {
      id: Math.random().toString(36).slice(2),
      type: isPositive ? "positive" : "negative",
      image: img,
      x,
      y,
      current,
      xListener,
      yListener,
      sliced: false,
      driftX: startX + (Math.random() * 300 - 150),
    };
  };

  const animateIcon = (icon) => {
    const launchDuration = 1500 + Math.random() * 500;
    const fallDuration = 1800 + Math.random() * 600;
    const driftX = icon.driftX;

    Animated.timing(icon.y, {
      toValue: height * 0.3,
      duration: launchDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(icon.y, {
        toValue: height + 150,
        duration: fallDuration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        requestAnimationFrame(() => {
          setIcons((prev) => prev.filter((i) => i.id !== icon.id));
          try {
            if (icon.xListener) icon.x.removeListener(icon.xListener);
            if (icon.yListener) icon.y.removeListener(icon.yListener);
          } catch {}
        });
      });
    });

    Animated.timing(icon.x, {
      toValue: driftX,
      duration: launchDuration + fallDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const playSound = async (type) => {
    try {
      if (type === "positive" && popSound.current)
        await popSound.current.replayAsync();
      if (type === "negative" && alertSound.current)
        await alertSound.current.replayAsync();
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  };

  const handleIconPress = (icon) => {
    if (icon.sliced) return;
    icon.sliced = true;

    if (icon.type === "positive") {
      setScore((s) => s + 1);
      playSound("positive");
    } else {
      setScore((s) => Math.max(0, s - 1));
      playSound("negative");
    }

    sliceIcon(icon.id);
  };

  const sliceIcon = (id) => {
    setIcons((prev) => prev.filter((p) => p.id !== id));
  };

  const renderIcons = () =>
    icons.map((icon) => {
      const translateX = icon.x;
      const translateY = icon.y;
      return (
        <Animated.View
          key={icon.id}
          style={[
            styles.iconWrapper,
            { transform: [{ translateX }, { translateY }] },
          ]}
        >
          <TouchableWithoutFeedback onPress={() => handleIconPress(icon)}>
            <View style={styles.touchableHitbox}>
              <Image source={icon.image} style={styles.iconImage} />
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      );
    });

  return (
    <ImageBackground
      source={require("../../../assets/images/calmCatcherbg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* 🔙 Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/Games")} // 👈 Redirects to Games index
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        {!gameStarted && !gameOver && (
          <View style={styles.overlay}>
            <Text style={styles.title}>🧘 Calm Catcher</Text>
            <Text style={styles.description}>
              Tap positive thoughts to score points and avoid negative ones.
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameStarted && (
          <>
            <Text style={styles.timer}>⏱ {timeLeft}s</Text>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
          </>
        )}

        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {renderIcons()}
        </View>

        {gameOver && (
          <View style={styles.overlay}>
            <Text style={styles.title}>Time’s Up!</Text>
            <Text style={styles.description}>Your Score: {score}</Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 50,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 20,
  },
  overlay: {
    position: "absolute",
    zIndex: 40,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    color: "#313647",
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    color: "#313647",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#7B542F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  timer: {
    position: "absolute",
    top: 42,
    right: 18,
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    zIndex: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scoreBox: {
    position: "absolute",
    top: 40,
    left: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scoreText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  iconWrapper: {
    position: "absolute",
    width: ICON_SIZE * 2,
    height: ICON_SIZE * 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -ICON_SIZE,
    marginTop: -ICON_SIZE,
  },
  touchableHitbox: { padding: 20, borderRadius: 999 },
  iconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
  },
});
