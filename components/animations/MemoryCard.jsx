// components/memory/MemoryCard.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export default function MemoryCard({ style, memory, color }) {
  const uri = memory.image_base64
    ? `data:${memory.mime};base64,${memory.image_base64}`
    : null;

  return (
    <Animated.View style={[style]}>
      <View style={[styles.container, { backgroundColor: color }]}>
        
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text>No Image</Text>
          </View>
        )}

        <Text style={styles.caption}>{memory.caption}</Text>

        <Text style={styles.date}>
          {memory.created_at
            ? new Date(memory.created_at).toLocaleDateString()
            : ""}
            
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 12,
    width: "100%",
    height:"300"
  },

  image: {
    width: "100%",
    height: 230,
    borderRadius: 12,
    resizeMode: "cover",
  },

  caption: {
    marginTop: 10,
    fontSize: 20,
    color: "#333",
    fontFamily: "Amsterdam",
    fontWeight:"normal",
    textAlign:"center"
  },

  date: {
    marginTop: 16,
    fontSize: 14,
    color: "#222",   // DARKER TEXT
    fontFamily: "Amsterdam",  // prettier font
    textAlign: "center",
  },
  

});
