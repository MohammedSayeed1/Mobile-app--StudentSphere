// components/animations/CardStack.tsx
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Card from "./Card"; // default journal card
import { Colors } from "../animations/Color";

const { width, height } = Dimensions.get("window");

const CardContainer = ({
  id,
  color,
  priority,
  allPriorities,
  data,
  disableAnimation,
  totalCards,
  onViewJournals,
  CardRenderer, // ✔ receives component here
}) => {
  const yTranslation = useSharedValue(30);
  const rotation = useSharedValue(30);
  const isRightFlick = useSharedValue(true);

  const gesture = disableAnimation
    ? Gesture.Pan()
    : Gesture.Pan()
        .onBegin(({ absoluteX }) => {
          isRightFlick.value = absoluteX >= width / 2;
        })
        .onUpdate(({ translationY }) => {
          yTranslation.value = translationY + 30;
          rotation.value = translationY + 30;
        })
        .onEnd(() => {
          if (totalCards === 1) return;

          // rotate deck
          const values = allPriorities.map((p) => p.value);
          const last = values.pop();
          values.unshift(last);

          for (let i = 0; i < allPriorities.length; i++) {
            allPriorities[i].value = values[i];
          }

          yTranslation.value = withTiming(30, { duration: 350 });
          rotation.value = withTiming(-1293, { duration: 400 });
        });

  const style = useAnimatedStyle(() => {
    const sorted = [...allPriorities].sort((a, b) => b.value - a.value);
    const indexInStack = sorted.indexOf(priority);

    const base = 10;
    const firstSpacing = 50;
    const nextSpacing = 20;

    let top = base;

    if (indexInStack < 3) {
      top += indexInStack * firstSpacing;
    } else {
      const extra = indexInStack - 2;
      top += firstSpacing * 2 + extra * nextSpacing;
    }

    const transforms = disableAnimation
      ? []
      : [
          { translateY: yTranslation.value },
          {
            rotate: `${interpolate(
              rotation.value,
              [30, height],
              isRightFlick.value ? [0, 4] : [0, -4]
            )}rad`,
          },
          { scale: withTiming(priority.value) },
        ];

    return {
      position: "absolute",
      height: "auto",
      width: 325,
      backgroundColor: color,
      bottom: withTiming(top, { duration: 100 }),
      borderRadius: 12,
      zIndex: priority.value * 1000,
      transform: transforms,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <CardRenderer
        id={id}
        style={style}
        data={data}
        memory={data}
        onViewJournals={onViewJournals}
        
      />
    </GestureDetector>
  );
};

export default function CardStack({
  cards,
  onViewJournals,
  CardComponent, // 🔥 optional override
}) {
  const disableAnimation = cards.length === 1;

  // default renderer (journal)
  const CardRenderer = CardComponent || Card;
  const COLOR_ARRAY = Object.values(Colors);

  const allPriorities = cards.map((_, i) => useSharedValue(1 - i * 0.05));

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <CardContainer
          key={index}
          id={index}
          data={card}
          
          // 🟩 FIXED — Now cycling correctly
          color={COLOR_ARRAY[index % COLOR_ARRAY.length]}
          
          priority={allPriorities[index]}
          allPriorities={allPriorities}
          totalCards={cards.length}
          disableAnimation={disableAnimation}
          onViewJournals={onViewJournals}
          CardRenderer={CardRenderer}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    alignItems: "center",
    justifyContent: "center",
  },
});
