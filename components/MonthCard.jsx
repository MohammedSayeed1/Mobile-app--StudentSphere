import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function MonthCard({
  month,
  summary,
  isCover = false,
  coverImage,
  onViewJournals,
  indexLabel,
  fontFamilies = {},
}) {
  if (isCover) {
    return (
      <ImageBackground
        source={coverImage}
        style={[styles.card, styles.coverCard]}
        imageStyle={styles.coverImage}
      >
        <View style={styles.coverInner}>
          <Text style={[styles.coverTitle, { fontFamily: fontFamilies.bold }]}>
            StudentSphere - Diary
          </Text>
          <Text
            style={[styles.coverSub, { fontFamily: fontFamilies.regularItalic }]}
          >
            Welcome to your safe space
          </Text>

          <TouchableOpacity
            onPress={onViewJournals}
            style={[styles.viewButton, { backgroundColor: "#3c3d37" }]}
          >
            <Text style={[styles.viewButtonText, { fontFamily: fontFamilies.bold }]}>
              View Journals
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.card]}>
      <View style={styles.cardInner}>
        <Text style={[styles.monthText, { fontFamily: fontFamilies.bold }]}>
          {month}
        </Text>

        <Text
          style={[styles.summaryText, { fontFamily: fontFamilies.regular }]}
          numberOfLines={6}
        >
          {summary || "No summary available for this month."}
        </Text>

        <TouchableOpacity onPress={onViewJournals} style={styles.viewButton}>
          <Text style={[styles.viewButtonText, { fontFamily: fontFamilies.bold }]}>
            View Journals
          </Text>
        </TouchableOpacity>

        <Text style={[styles.indexLabel, { fontFamily: fontFamilies.regularItalic }]}>
          {indexLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: Math.min(width * 0.88, 360),
    height: 460,
    borderRadius: 16,
    backgroundColor: "#fffaf0",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
    alignSelf: "center",
    overflow: "hidden",
    justifyContent: "center",
  },
  coverCard: {
    backgroundColor: "#d6bfa3",
  },
  coverImage: {
    resizeMode: "cover",
    opacity: 0.95,
  },
  coverInner: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  coverTitle: {
    color: "#ffffff",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  coverSub: {
    color: "#fff9f5",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
    opacity: 0.95,
  },

  cardInner: {
    flex: 1,
    padding: 22,
    justifyContent: "space-between",
  },

  monthText: {
    fontSize: 22,
    color: "#2c2c2c",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: "#4b4b4b",
    lineHeight: 20,
    flexShrink: 1,
  },

  viewButton: {
    marginTop: 16,
    backgroundColor: "#547792",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 15,
  },

  indexLabel: {
    fontSize: 12,
    color: "#7a7a7a",
    marginTop: 8,
    textAlign: "center",
  },
});
