import React from "react";
import { Stack } from "expo-router";

export default function GamesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // hides the white header
        }}
      />
      <Stack.Screen
        name="calmCatcher"
        options={{
          headerShown: false, // hides the white header
        }}
        />
        <Stack.Screen
          name="calm-quest"
          options={{
            headerShown: false,
          }}
          />
        <Stack.Screen
          name="focusdash"
          options={{
            headerShown:false,
          }}
          />

    </Stack>
  );
}
