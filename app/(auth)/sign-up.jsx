import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { Link, useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";
import LottieView from "lottie-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { useAnimatedKeyboard } from "react-native-reanimated";
import { useGlobalAlert } from "../../components/globalAlert";

const SignUp = () => {
  const router = useRouter();
  const { showAlert } = useGlobalAlert();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 Keyboard animation
  const keyboard = useAnimatedKeyboard();
  const screenShift = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const keyboardListener = useAnimatedStyle(() => {
    runOnJS(setKeyboardOpen)(keyboard.height.value > 0);
    return {};
  });

  const animatedScreenStyle = useAnimatedStyle(() => {
    const offset = keyboard.height.value > 0 ? -keyboard.height.value + 120 : 0;
    screenShift.value = withTiming(offset, { duration: 350, easing: Easing.out(Easing.cubic) });
    return { transform: [{ translateY: screenShift.value }] };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    const scaleValue = keyboard.height.value > 0 ? 0.65 : 1;
    imageScale.value = withTiming(scaleValue, { duration: 350, easing: Easing.out(Easing.cubic) });
    return { transform: [{ scale: imageScale.value }] };
  });

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      showAlert("error", "Please fill all fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("http://192.168.29.215:5010/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 201) {
        setTimeout(() => router.push("/sign-in"), 300);
      } else {
        showAlert("error", data.message || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      showAlert("error", "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* inject keyboard listener */}
      <Animated.View style={keyboardListener} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!keyboardOpen}
          contentContainerStyle={{ paddingBottom: keyboardOpen ? 0 : 30 }}
        >
          <Animated.View style={animatedScreenStyle}>

            {/* 🌟 Animated Lottie Image */}
            <Animated.View style={[animatedImageStyle, { alignItems: "center", marginTop: 10 }]}>
              <LottieView
                source={require("../../assets/Animations/Animation1.json")}
                autoPlay
                loop
                style={{ width: 250, height: 250 }}
              />
            </Animated.View>

            {/* 🌟 Form Section */}
            <View className="w-full justify-center px-4 pb-10">
              <Text className="text-3xl italic font-light">StudentSphere</Text>
              <Text className="text-2xl text-semibold font-psemibold mt-1">Sign Up!</Text>

              <FormField
                title="Username"
                value={form.username}
                handleChangeText={(e) => setForm({ ...form, username: e })}
                otherStyles="mt-7"
              />

              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-5"
                keyboardType="email-address"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="mt-5"
                secureTextEntry
              />

              <CustomButton
                title="Sign Up"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={isSubmitting}
              />

              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="text-lg text-gray-500 font-pregular">
                  Already have an account?
                </Text>

                <Link
                  href="/sign-in"
                  className="text-lg font-psemibold text-secondary"
                >
                  Sign In
                </Link>
              </View>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
