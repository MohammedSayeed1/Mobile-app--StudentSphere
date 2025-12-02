import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { ImageBackground } from "react-native";


const AlertCard = ({ visible, type, title, message, image, onClose }) => {
  const isSuccess = type === "success";
  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
  });
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* TOP SECTION */}
         
        <ImageBackground
          source={image}
          style={styles.topSectionImage}
          imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          resizeMode="cover"
        >
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
        </ImageBackground>

          {/* BUTTON */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.button,
                { borderColor: isSuccess ? "#73AF6F" : "#D9534F" },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: isSuccess ? "#73AF6F" : "#D9534F" },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertCard;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 12,
  },

  topSection: {
    paddingVertical: 38,
    alignItems: "center",
  },

  topSectionImage: {
    width: "100%",
    height:"200",
    justifyContent:"flex-end",
    alignItems: "center",
  },
  

  alertTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },

  buttonContainer: {
    padding: 15,
    alignItems: "center",
  },

  button: {
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
  },

  buttonText: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
  },
});
