// components/tasks/TaskCard.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Image,
} from "react-native";

import { TASK_LIBRARY } from "../../constants/task_library";
import heartOutline from "../../assets/icons/outline.png";
import heartFilled from "../../assets/icons/filled.png";

export default function TaskCard({ task, onOpen, index }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const [modalMessage, setModalMessage] = useState("");

  // -----------------------------------
  // GET DESCRIPTION FROM TASK_LIBRARY
  // -----------------------------------
  const allLibraryTasks = Object.values(TASK_LIBRARY).flat();
  const match = allLibraryTasks.find((t) => t.id === task.id);
  const description = match?.description || "(no description found)";

  // -----------------------------------
  // LIVE COUNTDOWN (MM:SS)
  // -----------------------------------
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const exp = new Date(task.expires_at);
      const diff = Math.max(0, Math.floor((exp - now) / 1000)); // difference in seconds
      setTimeLeft(diff);
    };

    update(); // immediate update
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [task.expires_at]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // -----------------------------------
  // PASTEL COLORS
  // -----------------------------------
  const pastelColors = ["#FDE2E4", "#E2F0CB", "#CDEDF6", "#FFF1C9", "#EADCF8"];
  const backgroundColor = pastelColors[index % pastelColors.length];

  // -----------------------------------
  // SHOW MODAL WITH FADE
  // -----------------------------------
  const showModal = (text) => {
    setModalMessage(text);
    setModalVisible(true);
    modalOpacity.setValue(0);

    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }, 1800); // total ~2 seconds
  };

  // -----------------------------------
  // HEART TOGGLE
  // -----------------------------------
  const toggleFavourite = () => {
    const next = !isFav;
    setIsFav(next);

    if (next) {
      showModal("⭐ Added to favourites");
    } else {
      showModal("❌ Removed from favourites");
    }
  };

  return (
    <>
      {/* CARD */}
      <View style={[styles.card, { backgroundColor }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{task.title}</Text>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {task.duration ? `${task.duration}m • ${task.type}` : task.type}
            </Text>

            {/* HEART ICON */}
            <TouchableOpacity onPress={toggleFavourite} style={{ marginLeft: 10 }}>
              <Image
                source={isFav ? heartFilled : heartOutline}
                style={styles.heartIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* RIGHT SIDE - COUNTDOWN + START */}
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.timer}> {minutes}:{seconds}</Text>

          <TouchableOpacity style={styles.btn} onPress={() => onOpen(task)}>
            <Text style={styles.btnTxt}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { opacity: modalOpacity }]}>
            <Text style={styles.modalText}>{modalMessage}</Text>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  title: {
    fontFamily: "Gilroy-Bold",
    fontSize: 17,
    color: "#333",
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
    fontFamily: "Gilroy-Regular",
    textAlign: "justify",
    paddingRight: 10,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  meta: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
  },
  heartIcon: {
    width: 22,
    height: 22,
  },
  timer: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
  },
  btn: {
    backgroundColor: "#3c3d37",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  btnTxt: {
    color: "white",
    fontFamily: "Gilroy-Bold",
  },

  // MODAL STYLES
  modalOverlay: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    elevation: 6,
  },
  modalText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Gilroy-Bold",
  },
});
