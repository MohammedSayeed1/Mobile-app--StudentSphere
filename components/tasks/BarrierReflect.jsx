import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";

export default function BarrierReflect({ task, onComplete }) {
  const barriers = [
    "I feel like a burden",
    "I'm scared of being ignored",
    "I don't want to bother anyone",
    "I feel unworthy of support",
    "I overthink what to say",
    "I assume people are too busy",
    "Past experiences hold me back",
    "I worry people won’t understand me",
  ];

  const [selected, setSelected] = useState([]);
  const [reflection, setReflection] = useState("");

  const toggleBarrier = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((b) => b !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const canComplete =
    selected.length > 0 || reflection.trim().length > 0;

  const handleSubmit = () => {
    console.log("🧠 Barrier Reflect → Completed");
    console.log("Selected barriers:", selected);
    console.log("Reflection:", reflection);

    onComplete();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/tasksbg.jpg")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}> What Stops Me?</Text>

        <Text style={styles.description}>
          Sometimes reaching out feels hard, even when we want connection.{"\n"}
          Take a moment to reflect — gently, without judgment — on what feels
          like a barrier for you.
        </Text>

        <Text style={styles.sectionLabel}>Choose the barriers that feel true:</Text>

        {barriers.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.card,
              selected.includes(item) && styles.cardSelected,
            ]}
            onPress={() => toggleBarrier(item)}
          >
            <Text
              style={[
                styles.cardText,
                selected.includes(item) && styles.cardTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Or describe your own barrier:</Text>

        <TextInput
          style={styles.input}
          placeholder="Write your thoughts here..."
          placeholderTextColor="#777"
          multiline
          value={reflection}
          onChangeText={setReflection}
        />

        <TouchableOpacity
          style={[
            styles.completeBtn,
            !canComplete && styles.disabledBtn,
          ]}
          disabled={!canComplete}
          onPress={handleSubmit}
        >
          <Text style={styles.completeText}>
            {canComplete ? "Mark as Completed" : "Select or Describe a Barrier"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 20,
    textAlign:"center"
  },

  description: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    opacity: 0.9,
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
    color: "#111",
    marginBottom: 10,
    marginTop: 10,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  cardSelected: {
    backgroundColor: "white",
    borderColor: "#3c3d37",
  },

  cardText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
  },

  cardTextSelected: {
    color: "#3c3d37",
    fontFamily: "Gilroy-Bold",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    color: "#111",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  completeBtn: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },

  disabledBtn: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  completeText: {
    color: "#3c3d37",
    fontFamily: "Gilroy-Bold",
    fontSize: 16,
  },
});
