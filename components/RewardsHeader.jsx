import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";

export default function RewardsHeader({ onBack }) {
  return (
    <>
      <ImageBackground
        source={require("../assets/images/rewards.jpg")}
        style={styles.header}
      />
      <View style={styles.row}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Rewards</Text>
          <Text style={styles.subtitle}>Earn points • Unlock rewards</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { height: 160 },
  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  back: { fontSize: 18,fontFamily:"Gilroy-Bold",},
  title: { fontSize: 26, fontFamily:"Gilroy-Bold", },
  subtitle: { fontSize: 14, color: "#556080", fontFamily:"Gilroy-Regular", },
});
