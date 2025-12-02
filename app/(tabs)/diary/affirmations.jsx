import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const Affirmations = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/Animations/Building Page.json')} // 🔥 Replace with your file
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />

      <Text style={styles.text}>
        Your Affirmation section is on the way 
      </Text>
    </View>
  );
};

export default Affirmations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    fontFamily: 'Gilroy-Regular',
    color: '#3c3d37',
    textAlign: 'center',
  },
});
