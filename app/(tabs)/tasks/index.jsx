// app/(tabs)/tasks/index.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  FlatList,
  Modal,
  TouchableOpacity
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import TaskCard from "../../../components/tasks/TaskCard";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rewardModal, setRewardModal] = useState(null);

  const router = useRouter();
  const params = useLocalSearchParams();

  // ------------------------------
  // Handle reward modal
  // ------------------------------
  useEffect(() => {
    if (!params.reward) return;

    try {
      const r = JSON.parse(params.reward);
      setRewardModal(r);
    } catch {}

  }, [params.reward]);

  // ------------------------------
  // FORCE REFRESH on return from task screen
  // ------------------------------
  useEffect(() => {
    if (params.refresh === "1" && username) {
      loadTasks(username);
    }
  }, [params.refresh, username]);

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
      return username?.trim() || null;
    } catch {
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
        `https://studentsphere-mobile-app-backend.onrender.com/get-tasks?username=${encodeURIComponent(u)}`
      );
      const data = await resp.json();

      const now = new Date();

      const cleaned = (data.tasks || []).filter(
        t => t.status !== "completed" && new Date(t.expires_at) > now
      );

      setTasks(cleaned);
    } catch (err) {
      console.log("Load tasks error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      const u = await readUsername();
      setUsername(u);
      if (u) loadTasks(u);
    })();
  }, []);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    loadTasks(username);
  };

  const openTask = (task) => {
    router.push({
      pathname: "/tasks/[taskId]",
      params: { taskId: task.id },
    });
  };

  const animateRemoval = (taskId, callback) => {
    if (!animatedValues[taskId]) return callback();
    Animated.timing(animatedValues[taskId], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(callback);
  };

  // ------------------------------
  // UI
  // ------------------------------
  if (!username) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.emptyText}>Loading your profile...</Text>
      </View>
    );
  }

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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => {
            if (!animatedValues[item.id]) {
              animatedValues[item.id] = new Animated.Value(1);
            }

            return (
              <Animated.View
                style={{
                  opacity: animatedValues[item.id],
                  transform: [{ scale: animatedValues[item.id] }],
                }}
              >
                <TaskCard
                  task={item}
                  index={index}
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

      {/* Reward Modal */}
      {rewardModal && (
        <Modal transparent animationType="fade">
          <View style={styles.rewardOverlay}>
            <View style={styles.rewardCard}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setRewardModal(null)}
              >
                <Text style={{ fontSize: 20 }}>✖</Text>
              </TouchableOpacity>

              <Text style={styles.rewardTitle}>+{rewardModal.added_points} Points</Text>
              <Text style={styles.rewardText}>Total Points: {rewardModal.total_points}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fafaf5" },
  title: { fontSize: 24, fontFamily: "Gilroy-Bold", marginBottom: 20 },
  emptyText: { fontSize: 16, color: "#777", textAlign: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  rewardOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  rewardCard: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
    position: "relative",
  },
  rewardTitle: {
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
  },
  rewardText: {
    fontSize: 18,
    fontFamily: "Gilroy-Regular",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 6,
  },
});
