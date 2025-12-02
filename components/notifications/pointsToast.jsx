import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Image, Dimensions, View } from "react-native";

const { width } = Dimensions.get("window");

export default function PointsToast({ visible, pointsAdded, totalPoints, onHide }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let hideTimer;
  
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]).start();
  
      hideTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(onHide);
      }, 3000);
    }
  
    return () => clearTimeout(hideTimer);
  }, [visible]);
  

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacity,
        },
      ]}
    >
      <Image
        source={require("../../assets/images/star.png")}  // ⭐ your coin/star icon
        style={styles.icon}
      />
      <View>
        <Text style={styles.pointsText}>+{pointsAdded} Points</Text>
        <Text style={styles.totalText}>Total: {totalPoints}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 100,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: "#2C2C2C",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    // 💥 Make it appear above EVERYTHING
    zIndex: 99999,
    elevation: 99999,
    flexDirection: "row",
    alignItems: "center",
  },
  
  icon: {
    width: 36,
    height: 36,
    marginRight: 14,
  },
  pointsText: {
    color: "#FFD93D",
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
  },
  totalText: {
    color: "#EEEEEE",
    fontSize: 14,
    marginTop: 2,
    fontFamily: "Gilroy-Regular",
  },
});
