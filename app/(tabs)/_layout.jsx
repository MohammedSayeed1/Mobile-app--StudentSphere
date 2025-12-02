import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Tabs, router } from 'expo-router';
import { icons } from '../../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const TabIcon = ({ icon, color, name, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, paddingTop: 20 }}>
    <Image
      source={icon}
      resizeMode="contain"
      style={{ width: 24, height: 24, tintColor: color }}
    />
    <Text style={{
      fontSize: 10,
      fontWeight: focused ? '600' : '400',
      color,
      textAlign: 'center',
    }}>
      {name}
    </Text>
  </View>
);

const CustomHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#161622',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        zIndex: 99,
      }}
    >
      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          color: '#FAF8F1',
          fontSize: 26,
          fontStyle: 'italic',
          fontWeight: '300'
        }}>
          Studentsphere
        </Text>
      </View>

      {dropdownVisible && (
        <View style={{
          position: 'absolute',
          right: 16,
          top: Platform.OS === 'android' ? 60 : 70,
          backgroundColor: '#232533',
          padding: 8,
          borderRadius: 8,
          width: 150,
          zIndex: 999,
        }}>
          <TouchableOpacity
            style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#444' }}
          >
            <Text style={{ color: '#fff' }}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#444' }}
          >
            <Text style={{ color: '#fff' }}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 8 }}
            onPress={async () => {
              await AsyncStorage.clear();
              router.replace("/sign-in");
            }}
          >
            <Text style={{ color: '#f87171' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default function TabsLayout() {
  return (
    <>
      <CustomHeader />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FAF8F1',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#111',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: Platform.OS === 'android' ? 100 : 90, // increase height for Android
            paddingBottom: Platform.OS === 'android' ? 20 : 0, // extra bottom padding for Android
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="diary"
          options={{
            title: 'Diary',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.diary} color={color} name="Diary" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="Games"
          options={{
            title: 'Games',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.game} color={color} name="Games" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="goal"
          options={{
            title: 'Goals',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.goal} color={color} name="Goals" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
