import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/sign-in");
        }
      } catch (err) {
        console.log("Auth check error:", err);
        router.replace("/sign-in");
      }
    };

    setTimeout(checkLogin, 50); // small delay fixes splash freeze
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#161622" }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
