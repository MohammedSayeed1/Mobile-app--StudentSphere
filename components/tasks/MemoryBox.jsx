// components/tasks/MemoryBox.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CardStack from "../animations/CardStack";
import MemoryCard from "../animations/MemoryCard";

export default function MemoryBox({ task, onComplete }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = async () => {
    try {
      const username =
        (await AsyncStorage.getItem("username")) ||
        JSON.parse((await AsyncStorage.getItem("user")) || "{}")?.username;

      const resp = await fetch(
        `http://192.168.29.215:5010/get-memories?username=${encodeURIComponent(
          username
        )}`
      );

      const json = await resp.json();
      setMemories(json.memories || []);
      setLoading(false);
    } catch (err) {
      console.log("Memory fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  if (memories.length === 0)
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No memories yet.</Text>
      </View>
    );

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>📁 Memory Box</Text>

        {/* 🌟 NEW CAPTION */}
        <Text style={styles.subtitle}>Swipe through your saved moments ✨</Text>

        <View style={{ height: 350, alignItems: "center" }}>
          <CardStack
            cards={memories}
            CardComponent={MemoryCard}
          />
        </View>

        <TouchableOpacity style={styles.doneBtn} onPress={onComplete}>
          <Text style={styles.doneText}>Back to Tasks</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.3)" },

  container: { flex: 1, padding: 20, paddingTop: 40 },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
    color: "#222",
    textAlign:"center"
  },

  // 🌟 NEW SUBTITLE STYLE
  subtitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#444",
    marginBottom: 20,
    textAlign:"center"
  },

  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#444" },

  doneBtn: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 40,
  },
  doneText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },
});
