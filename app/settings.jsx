// Updated Settings.jsx with added Privacy & Security tab
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Settings() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
  });

  if (!fontsLoaded) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FBEEFC" barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <Text style={styles.sectionTitle}>GENERAL</Text>

        <Animated.View entering={FadeInUp.duration(300)}>
          <SettingRow
            icon={<Feather name="user" size={22} color="#333" />}
            label="Account"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(300)}>
          <SettingRow
            icon={<Ionicons name="notifications-outline" size={22} color="#333" />}
            label="Notifications"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(300)}>
          <SettingRow
            icon={<Ionicons name="gift-outline" size={22} color="#333" />}
            label="Coupons"
          />
        </Animated.View>

        {/* ✅ Added Privacy & Security Tab */}
        <Animated.View entering={FadeInUp.delay(140).duration(300)}>
          <SettingRow
            icon={<Feather name="lock" size={22} color="#333" />}
            label="Privacy & Security"
            onPress={() => router.push("/privacy")}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(300)}>
          <TouchableOpacity
            style={styles.row}
            onPress={async () => {
              try {
                await AsyncStorage.clear();
                router.replace("/sign-in");
              } catch (error) {
                console.log("Logout error:", error);
              }
            }}
          >
            <View style={styles.rowLeft}>
              <Feather name="log-out" size={22} color="#e63946" />
              <Text style={[styles.rowLabel, { color: "#e63946" }]}>Logout</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(300)}>
          <SettingRow
            icon={<MaterialIcons name="delete-outline" size={22} color="#333" />}
            label="Delete account"
          />
        </Animated.View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>FEEDBACK</Text>

        <Animated.View entering={FadeInUp.delay(260).duration(300)}>
          <SettingRow
            icon={<Feather name="alert-triangle" size={22} color="#333" />}
            label="Report a bug"
            onPress={() => router.push("/report-bug")}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(300)}>
          <SettingRow
            icon={<Feather name="message-circle" size={22} color="#333" />}
            label="Send feedback"
            onPress={() => router.push("/feedback")}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const SettingRow = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowLeft}>
      {icon}
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF8EF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 180,
    backgroundColor: "#FBEEFC",
    paddingTop: 50,
  },
  headerTitle: {
    fontFamily: "Gilroy-Bold",
    fontSize: 22,
    marginLeft: 10,
  },
  sectionTitle: {
    fontFamily: "Gilroy-Bold",
    color: "#777",
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginBottom: 1,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowLabel: {
    fontFamily: "Gilroy-Regular",
    fontSize: 16,
    marginLeft: 12,
  },
});
