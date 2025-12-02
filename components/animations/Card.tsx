import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFonts } from "expo-font";

interface CardProps {
  id: number;
  style: object;
  data: {
    month: string;
    year: number;
    summary: string;
  };
  onViewJournals?: (data: any) => void;
}

const Card: FC<CardProps> = ({ style, data, onViewJournals }) => {
  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../assets/fonts/Gilroy-Bold.ttf"),
  });

  return (
    <Animated.View style={[style]}>
      <View style={cardStyle.container}>
        {data && (
          <View style={cardStyle.contentBox}>

            <Text style={cardStyle.monthText}>{data.month}</Text>

            {/* Content + summary limited to 5 lines */}
            <View style={cardStyle.summaryWrapper}>
              <Text
                style={cardStyle.summaryText}
                numberOfLines={5}
                ellipsizeMode="tail"
              ><Text style={cardStyle.summaryStyle}> Summary: </Text>
                {data.summary}
              </Text>

              {/* View Journals Button */}
              <TouchableOpacity
                style={cardStyle.viewButton}
                onPress={() => onViewJournals?.(data)}
              >
                <Text style={cardStyle.viewButtonText}>View Journals →</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </View>
    </Animated.View>
  );
};

const cardStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 200, // FIX: ensures bottom-right works
  },

  contentBox: {
    padding: 15,
    borderRadius: 12,
    width: "100%",
    height: "100%", // ensures absolute children know where to position
  },

  monthText: {
    fontSize: 24,
    color: "#222",       // FIXED
    marginBottom: 8,
    fontFamily: "Gilroy-Bold",
    textAlign: "center",
  },
  summaryStyle:{
    fontFamily:"Gilroy-Bold",
    fontSize:16
  },

  summaryWrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },

  summaryText: {
    fontSize: 15,
    color: "#222",       // FIXED (white was invisible)
    fontFamily: "Gilroy-Regular",
    textAlign: "justify",
  },

  viewButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  viewButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },
});

export default Card;
