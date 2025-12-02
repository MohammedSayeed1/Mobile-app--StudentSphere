import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// 🔥 3 Dummy Journal Pages
const dummyPages = [
  {
    date: "January 1, 2025",
    text: "Today I began writing in this journal. Excited to start a new journey!",
  },
  {
    date: "January 2, 2025",
    text: "Worked on a page flip animation today. It's starting to look like a real book!",
  },
  {
    date: "January 3, 2025",
    text: "Tomorrow, I plan to connect everything to the backend. Making progress!",
  }
];

export default function JournalBook() {
  const [page, setPage] = useState(0); // 0 = cover page
  const progress = useSharedValue(0);

  // 🔥 Flip to Next
  const flipToNext = () => {
    if (page < dummyPages.length) {
      progress.value = withTiming(1, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(setPage)(page + 1);
          progress.value = 0;
        }
      });
    }
  };

  // 🔥 Flip to Previous
  const flipToPrev = () => {
    if (page > 0) {
      progress.value = withTiming(-1, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(setPage)(page - 1);
          progress.value = 0;
        }
      });
    }
  };

  // 🔥 Page Flip Animation Style
  const animatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      progress.value,
      [-1, 0, 1],
      [-90, 0, 90],
      Extrapolate.CLAMP
    );
    const translateX = interpolate(
      progress.value,
      [-1, 0, 1],
      [-width * 0.4, 0, width * 0.4],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { translateX },
      ],
    };
  });

  return (
    <View style={styles.container}>
      
      {/* 🔥 Page Content (Cover or Journal Page) */}
      {page === 0 ? (
        <Animated.View style={[styles.page, styles.cover, animatedStyle]}>
          <Text style={styles.coverTitle}>My Journal</Text>
          <Text style={styles.coverSubtitle}>Tap Next to Begin</Text>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.page, animatedStyle]}>
          <Text style={styles.date}>{dummyPages[page - 1]?.date}</Text>
          <Text style={styles.text}>{dummyPages[page - 1]?.text}</Text>
        </Animated.View>
      )}

      {/* 🔥 Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={flipToPrev} disabled={page === 0}>
          <Text style={[styles.arrow, page === 0 && { opacity: 0.3 }]}>← Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={flipToNext}
          disabled={page === dummyPages.length}
        >
          <Text
            style={[
              styles.arrow,
              page === dummyPages.length && { opacity: 0.3 },
            ]}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


// ======================================================
// 🔥 Styles
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ecd4',
    justifyContent: 'center',
  },
  page: {
    width: width * 0.85,
    height: 500,
    alignSelf: 'center',
    backgroundColor: '#fffaf0',
    borderRadius: 10,
    padding: 25,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cover: {
    backgroundColor: '#d4a373',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  coverSubtitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#fffce8',
  },
  date: {
    fontSize: 16,
    color: '#5a5a5a',
    marginBottom: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 20,
    color: '#333',
    lineHeight: 28,
    marginTop: 10,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginTop: 30,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8b4513',
  },
});
