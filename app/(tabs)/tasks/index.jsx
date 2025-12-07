// app/(tabs)/tasks/index.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import TaskCard from "../../../components/tasks/TaskCard";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  // Store animated values for each task
  const animatedValues = {};

  // ------------------------------
  // Read username
  // ------------------------------
  const readUsername = async () => {
    try {
      let username = await AsyncStorage.getItem("username");

      if (!username) {
        const raw = await AsyncStorage.getItem("user");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            username = parsed?.username ?? parsed?.name ?? null;
          } catch {
            username = raw;
          }
        }
      }
      return username && username !== "null" ? String(username).trim() : null;
    } catch (e) {
      console.log("Error reading username:", e);
      return null;
    }
  };

  // ------------------------------
  // Fetch tasks
  // ------------------------------
  const loadTasks = useCallback(async (u, silent = false) => {
    try {
      if (!silent) setLoading(true);

      const resp = await fetch(
        `http://192.168.29.215:5010/get-tasks?username=${encodeURIComponent(u)}`
      );
      const data = await resp.json();

      if (!resp.ok) {
        console.log("Task load error:", data);
        setTasks([]);
        return;
      }

      // Filter out expired tasks
      const now = new Date();
      const active = (data.tasks || []).filter(
        (t) => new Date(t.expires_at) > now
      );

      setTasks(active);
    } catch (err) {
      console.log("Load tasks error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ------------------------------
  // Initial load
  // ------------------------------
  useEffect(() => {
    (async () => {
      const u = await readUsername();
      setUsername(u);
      if (u) loadTasks(u);
    })();
  }, []);

  // ------------------------------
  // Auto-refresh every 30 seconds
  // ------------------------------
  useEffect(() => {
    if (!username) return;

    const interval = setInterval(() => loadTasks(username, true), 60000);
    return () => clearInterval(interval);
  }, [username]);

  // ------------------------------
  // Pull-to-refresh
  // ------------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    loadTasks(username);
  };

  // ------------------------------
  // Navigate to task details
  // ------------------------------
  const openTask = (task) => {
    router.push({
      pathname: "/tasks/[taskId]",
      params: { taskId: task.id },
    });
  };

  // ------------------------------
  // Animate task removal
  // ------------------------------
  const animateRemoval = (taskId, callback) => {
    if (!animatedValues[taskId]) return callback();

    Animated.timing(animatedValues[taskId], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(callback);
  };

  // ------------------------------
  // If loading username
  // ------------------------------
  if (!username) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.emptyText}>Loading your profile...</Text>
      </View>
    );
  }

  // ------------------------------
  // Main View
  // ------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Your Wellbeing Tasks</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.emptyText}>Fetching tasks...</Text>
        </View>
      ) : tasks.length === 0 ? (
        <Text style={styles.emptyText}>No active tasks right now</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            // Create animated value
            if (!animatedValues[item.id]) {
              animatedValues[item.id] = new Animated.Value(1);
            }

            return (
              <Animated.View
                style={{
                  opacity: animatedValues[item.id],
                  transform: [
                    {
                      scale: animatedValues[item.id],
                    },
                  ],
                }}
              >
                <TaskCard
                  task={item}
                  onOpen={() => openTask(item)}
                  onRemove={() =>
                    animateRemoval(item.id, () => loadTasks(username))
                  }
                />
              </Animated.View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fafaf5" },
  title: { fontSize: 24, fontFamily: "Gilroy-Bold", marginBottom: 20 },
  emptyText: { fontSize: 16, color: "#777", marginTop: 20, textAlign: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
