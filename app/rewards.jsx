import React, { useEffect, useState, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import RewardsHeader from "../components/RewardsHeader";
import PointsLevelCard from "../components/PointsLevelCard";
import RewardsGrid from "../components/RewardGrid";
import CouponsList from "../components/CouponList";

import { calculateLevel } from "../utils/levelutils";

const MAX_LEVEL = 20;

export default function RewardsPage() {
  const router = useRouter();

  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);

  // ----------------------------
  // SAFE USERNAME READER
  // ----------------------------
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

      if (username && username !== "null") {
        return String(username).trim();
      }

      return null;
    } catch (e) {
      console.log("Error reading username:", e);
      return null;
    }
  };

  // ----------------------------
  // FETCH USER POINTS
  // ----------------------------
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const username = await readUsername();

        if (!username) {
          console.log("⚠️ Username not found, skipping points fetch");
          setPoints(0);
          return;
        }

        const res = await fetch(
          `http://192.168.29.215:5010/get-points?username=${username}`
        );

        const data = await res.json();
        setPoints(data.points || 0);
      } catch (e) {
        console.log("❌ Error fetching points:", e);
        setPoints(0);
      }
    };

    fetchPoints();
  }, []);

  // ----------------------------
  // FETCH LEVEL REWARDS
  // ----------------------------
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get(
          "http://192.168.29.215:5010/get-level-rewards"
        );

        setRewards(res.data.rewards || []);
      } catch (e) {
        console.log("❌ Error fetching rewards:", e);
        setRewards([]);
      }
    };

    fetchRewards();
  }, []);

  const levelData = useMemo(() => calculateLevel(points), [points]);

  return (
    <ScrollView style={styles.container}>
      <RewardsHeader onBack={() => router.back()} />

      <PointsLevelCard
        userPoints={points}
        levelData={levelData}
        maxLevel={MAX_LEVEL}
      />

      <RewardsGrid />

      <CouponsList
        rewards={rewards}
        currentLevel={levelData.currentLevel}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
});
