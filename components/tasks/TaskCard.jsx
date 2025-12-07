// components/tasks/TaskCard.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TaskCard({ task, onOpen }) {
  const minutesLeft = (() => {
    try {
      const now = new Date();
      const exp = new Date(task.expires_at);
      const diff = Math.max(0, exp - now);
      return Math.ceil(diff / 60000);
    } catch { return null; }
  })();

  return (
    <View style={styles.card}>
      <View style={{flex:1}}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.meta}>{task.duration ? `${task.duration}m • ${task.type}` : task.type}</Text>
      </View>

      <View style={{alignItems:"flex-end"}}>
        <Text style={styles.timer}>{minutesLeft != null ? `⏳ ${minutesLeft}m` : ""}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => onOpen(task)}>
          <Text style={styles.btnTxt}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", padding: 12, backgroundColor: "white", borderRadius: 12, marginBottom: 10, alignItems:"center", elevation:2 },
  title: { fontFamily: "Gilroy-Bold", fontSize: 16 },
  meta: { color: "#666", marginTop: 4 },
  timer: { fontSize: 12, color: "#888" },
  btn: { marginTop: 8, backgroundColor: "#3c3d37", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnTxt: { color: "white", fontFamily: "Gilroy-Bold" }
});
