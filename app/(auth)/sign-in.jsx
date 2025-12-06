import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { Link, useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalAlert } from "../../components/globalAlert";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { useAnimatedKeyboard } from "react-native-reanimated";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useGlobalAlert();
  const router = useRouter();

  // 🌟 Keyboard Animation
  const keyboard = useAnimatedKeyboard();

  const screenShift = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // ⬇ Sync keyboard height → React state (fixes bottom scroll issue)
  const keyboardListener = useAnimatedStyle(() => {
    runOnJS(setKeyboardOpen)(keyboard.height.value > 0);
    return {};
  });

  const animatedScreenStyle = useAnimatedStyle(() => {
    const offset = keyboard.height.value > 0 ? -keyboard.height.value + 70 : 0;

    screenShift.value = withTiming(offset, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });

    return {
      transform: [{ translateY: screenShift.value }],
    };
  });

  // 🌟 Smooth Lottie Image Scaling
  const animatedImageStyle = useAnimatedStyle(() => {
    const scaleValue = keyboard.height.value > 0 ? 0.75 : 1;

    imageScale.value = withTiming(scaleValue, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });

    return {
      transform: [{ scale: imageScale.value }],
    };
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      showAlert("error","Please fill all fields.");
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      const res = await fetch("http://192.168.29.215:5010", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (res.status === 200) {
        const userData = {
          username: data.username,
          email: form.email,
        };
  
        await AsyncStorage.setItem("user", JSON.stringify(userData));
  
  
        // ⭐ small delay so alert shows correctly
        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 300);
      } else {
        showAlert("error", data.message);
      }
    } catch (error) {
      console.error(error);
      showAlert("error","Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* inject keyboard listener */}
      <Animated.View style={keyboardListener} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!keyboardOpen}
          contentContainerStyle={{
            paddingBottom: keyboardOpen ? 0 : 30,
          }}
        >
          <Animated.View style={animatedScreenStyle}>
            
            {/* 🌟 Animated Image */}
            <Animated.View
              style={[
                animatedImageStyle,
                { alignItems: "center"},
              ]}
            >
              <LottieView
                source={require("../../assets/Animations/loginpage-animation.json")}
                autoPlay
                loop
                style={{ width: 300, height: 300 }}
              />
            </Animated.View>

            {/* 🌟 Text + Inputs */}
            <View className="w-full justify-center px-4 pb-10">
              <Text className="text-3xl italic font-light">StudentSphere</Text>
              <Text className="text-2xl text-semibold font-psemibold mt-1">
                Hola!
              </Text>

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
                title="Sign In"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={isSubmitting}
              />

              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="text-lg text-gray-500 font-pregular">
                  Don't Have an Account?
                </Text>

                <Link
                  href="/sign-up"
                  className="text-lg font-psemibold text-secondary"
                >
                  Sign Up
                </Link>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
