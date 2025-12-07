// app/(tabs)/tasks/[taskId].jsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SpreadKindness from "../../../components/tasks/SpreadKindness";
import CelebrateWin from "../../../components/tasks/CelebrateWin";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaskRunner() {
  const { taskId } = useLocalSearchParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------ Local username reader -------------
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

      username = username && username !== "null" ? String(username).trim() : null;
      console.log("📌 Username loaded:", username);
      return username;
    } catch (e) {
      console.log("❌ Username read error:", e);
      return null;
    }
  };

  // ------------ Load Task -------------------
  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const username = await readUsername();

      if (!username) {
        console.log("❌ No username found during loadTask");
        setLoading(false);
        return;
      }

      console.log("📌 Fetching task using taskId:", taskId);

      const resp = await fetch(
        `http://192.168.29.215:5010/get-task?task_id=${encodeURIComponent(taskId)}`
      );

      const data = await resp.json();
      console.log("📌 Task fetched:", data);

      if (!data.task) {
        console.log("❌ Task not found in backend");
        setTask(null);
      } else {
        setTask(data.task);
      }

    } catch (e) {
      console.log("❌ loadTask error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ------------ Complete Task -------------------
  const markComplete = async () => {
    console.log("🔥 markComplete CALLED!");
    try {
      const username = await readUsername();
      console.log(username)
      const payload = {
        username: username,
        task_id: task.id
      };
  
      console.log("📤 PAYLOAD TO SEND:", payload);
  
      const resp = await fetch("http://192.168.29.215:5010/complete-task", {
        method: "POST",
        headers: {
          Accept: "application/json",   // ← ADD THIS
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const json = await resp.json();
      console.log("📥 Backend response:", json);
  
      router.replace("/tasks");
  
    } catch (e) {
      console.log("❌ Complete task error:", e);
    }
  };
  
  
  

  // ------------ RENDER ------------------
  if (loading) return <ActivityIndicator size="large" />;
  if (!task) return <View />;

  switch (task.id) {
    case "happy_spread_kindness":
      return <SpreadKindness task={task} onComplete={markComplete} />;

    case "happy_celebrate_win":
      return <CelebrateWin task={task} onComplete={markComplete} />;

    default:
      return <View />;
  }
}
