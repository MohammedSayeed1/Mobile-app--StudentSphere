import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function Feedback() {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: "https://forms.cloud.microsoft/r/BidwBQ4Fx7",
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
