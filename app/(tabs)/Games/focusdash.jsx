// app/(tabs)/Games/focusdash.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

// --------- Replace / confirm these image imports match your assets ----------
const IMAGES = {
  easy: [
    require("../../../assets/images/easy1.jpg"),
    require("../../../assets/images/easy2.jpg"),
    require("../../../assets/images/easy3.jpg"),
    require("../../../assets/images/easy4.jpg"),
    require("../../../assets/images/easy5.jpg"),
    require("../../../assets/images/easy6.jpg"),
    require("../../../assets/images/easy7.jpg"),
    require("../../../assets/images/easy8.jpg"),
    require("../../../assets/images/easy9.jpg"),
    require("../../../assets/images/easy10.jpg"),
  ],
  medium: [
    require("../../../assets/images/easy10.jpg"),
    require("../../../assets/images/easy2.jpg"),
    require("../../../assets/images/easy3.jpg"),
    require("../../../assets/images/easy4.jpg"),
    require("../../../assets/images/easy5.jpg"),
    require("../../../assets/images/easy6.jpg"),
    require("../../../assets/images/easy7.jpg"),
    require("../../../assets/images/easy8.jpg"),
    require("../../../assets/images/easy9.jpg"),
    require("../../../assets/images/easy10.jpg"),
  ],
  hard: [
    require("../../../assets/images/easy3.jpg"),
    require("../../../assets/images/easy2.jpg"),
    require("../../../assets/images/easy3.jpg"),
    require("../../../assets/images/easy4.jpg"),
    require("../../../assets/images/easy5.jpg"),
    require("../../../assets/images/easy6.jpg"),
    require("../../../assets/images/easy7.jpg"),
    require("../../../assets/images/easy8.jpg"),
    require("../../../assets/images/easy9.jpg"),
    require("../../../assets/images/easy10.jpg"),
  ],
};

const DIFFICULTY_SETTINGS = {
  easy: { grid: 3, time: 60 }, // 3x3 looks nicer on phone for 'easy'
  medium: { grid: 4, time: 120 },
  hard: { grid: 5, time: 180 },
};

// You can tweak these constants for visuals
const BOARD_PADDING = 5;
const GAP = 0.1;

export default function FocusDash() {
  const router = useRouter();

  // Load Gilroy fonts
  const [fontsLoaded] = useFonts({
    "Gilroy-Regular": require("../../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-Bold": require("../../../assets/fonts/Gilroy-Bold.ttf"),
  });
  if (!fontsLoaded) return null;

  const [difficulty, setDifficulty] = useState(null);
  const [level, setLevel] = useState(0);
  const [gridSize, setGridSize] = useState(null);
  const [tiles, setTiles] = useState([]); // array of { id, correctIndex, currentIndex, anim, zIndex }
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [boardSize, setBoardSize] = useState(0);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [infoVisible, setInfoVisible] = useState(false);

  const dragInfoRef = useRef({ draggingId: null, startIndex: null });
  const timerRef = useRef(null);
  const windowW = Dimensions.get("window").width;

  // ---------- Timer control (start/clear) ----------
  useEffect(() => {
    // whenever difficulty or level changes, restart timer
    if (!difficulty) return;

    clearTimer();
    setGameOver(false);
    setLevelComplete(false);

    const time = DIFFICULTY_SETTINGS[difficulty].time;
    setTimeLeft(time);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, level]);

  // clear timer helper
  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // ---------- Start a difficulty ----------
  const startDifficulty = (mode) => {
    setDifficulty(mode);
    setLevel(0);
    const time = DIFFICULTY_SETTINGS[mode].time;
    setTimeLeft(time);
    setGridSize(DIFFICULTY_SETTINGS[mode].grid);
    setTiles([]);
    setGameOver(false);
    setLevelComplete(false);
  };

  // regenerate when grid/board/difficulty/level set
  useEffect(() => {
    if (!gridSize || boardSize === 0 || difficulty == null) return;
    generatePuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, boardSize, difficulty, level]);

  // ---------- Generate puzzle tiles ----------
  const generatePuzzle = () => {
    const grid = gridSize;
    const total = grid * grid;
    const image = IMAGES[difficulty][level % IMAGES[difficulty].length];

    // create tile objects in correct order
    const base = [];
    for (let i = 0; i < total; i++) {
      base.push({
        id: `t-${i}`,
        correctIndex: i,
        currentIndex: i,
        anim: new Animated.ValueXY({ x: 0, y: 0 }),
        zIndex: 0,
      });
    }

    // shuffle indices (Fisher-Yates)
    let indices = [...Array(total).keys()];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // ensure it's not already solved
    if (indices.every((v, i) => v === i)) {
      const j = Math.floor(Math.random() * total);
      indices[0] = j;
      indices[j] = 0;
    }

    const arranged = base.map((tile, i) => ({
      ...tile,
      currentIndex: indices[i],
    }));

    setTiles(arranged);

    // get image natural size to compute slices
    const src = Image.resolveAssetSource(image);
    Image.getSize(
      src.uri,
      (w, h) => setImageSize({ w, h }),
      () => setImageSize({ w: boardSize, h: boardSize })
    );
  };

  // ---------- Helpers: index <-> row/col and positions ----------
  const indexToRowCol = (index) => {
    return { row: Math.floor(index / gridSize), col: index % gridSize };
  };
  const rowColToIndex = (r, c) => r * gridSize + c;
  const tileContainerSize = () => {
    const usable = boardSize - BOARD_PADDING * 2 - GAP * (gridSize - 1);
    return usable / gridSize;
  };
  const tilePositionForIndex = (index) => {
    const { row, col } = indexToRowCol(index);
    const size = tileContainerSize();
    const x = BOARD_PADDING + col * (size + GAP);
    const y = BOARD_PADDING + row * (size + GAP);
    return { x, y, size };
  };

  // ---------- compute progress (PB2-B) based on correct tile positions ----------
  const computeProgress = () => {
    if (!tiles.length) return 0;
    const correct = tiles.reduce((acc, t) => acc + (t.currentIndex === t.correctIndex ? 1 : 0), 0);
    return Math.round((correct / tiles.length) * 100);
  };

  // watch tiles — when progress becomes 100% we finalize level (C1)
  useEffect(() => {
    const p = computeProgress();
    if (p === 100 && tiles.length > 0 && !levelComplete) {
      // stop timer and mark level complete (C1)
      clearTimer();
      setLevelComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  // ---------- Swap helper (safe) ----------
  const swapTileIndices = (movingId, targetIndex) => {
    setTiles((prev) => {
      const copy = prev.map((t) => ({ ...t }));
      const moving = copy.find((c) => c.id === movingId);
      const other = copy.find((c) => c.currentIndex === targetIndex);
      if (moving && other) {
        const tmp = moving.currentIndex;
        moving.currentIndex = other.currentIndex;
        other.currentIndex = tmp;
      }
      return copy;
    });
  };

  // ---------- PanResponder factory for each tile ----------
  const createPanResponder = (tile) => {
    const pan = tile.anim;
    // pos = where tile currently should be (based on its currentIndex)
    const pos = tilePositionForIndex(tile.currentIndex);

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragInfoRef.current.draggingId = tile.id;
        dragInfoRef.current.startIndex = tile.currentIndex;
        tile.zIndex = 1000;
        // set offset to current value (usually 0)
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();

        const dropX = pos.x + gestureState.dx + tileContainerSize() / 2;
        const dropY = pos.y + gestureState.dy + tileContainerSize() / 2;

        // Board origin considered at (BOARD_PADDING, BOARD_PADDING) within board container
        const relX = dropX - BOARD_PADDING;
        const relY = dropY - BOARD_PADDING;
        const col = Math.floor(relX / (tileContainerSize() + GAP));
        const row = Math.floor(relY / (tileContainerSize() + GAP));

        const within = row >= 0 && row < gridSize && col >= 0 && col < gridSize;
        let targetIndex;
        if (within) {
          targetIndex = rowColToIndex(row, col);
        } else {
          targetIndex = tile.currentIndex; // snap back
        }

        if (targetIndex !== tile.currentIndex) {
          // swap positions
          swapTileIndices(tile.id, targetIndex);
        }

        // animate tile back to grid (reset transform)
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          speed: 20,
        }).start(() => {
          dragInfoRef.current.draggingId = null;
          dragInfoRef.current.startIndex = null;
        });
      },
    });
  };

  // ---------- Render tile elements ----------
  const renderTiles = () => {
    if (!tiles.length) return null;
    const image = IMAGES[difficulty][level % IMAGES[difficulty].length];
    const size = tileContainerSize();
    const renderedImageSize = boardSize - BOARD_PADDING * 2; // square area we render the full image into

    // compute scale -> cover behavior so image fills board square
    const scale = Math.max(
      renderedImageSize / (imageSize.w || renderedImageSize),
      renderedImageSize / (imageSize.h || renderedImageSize)
    );
    const imgRenderW = (imageSize.w || renderedImageSize) * scale;
    const imgRenderH = (imageSize.h || renderedImageSize) * scale;

    return tiles.map((tileObj) => {
      const { x, y } = tilePositionForIndex(tileObj.currentIndex);
      const { row: correctRow, col: correctCol } = indexToRowCol(tileObj.correctIndex);
      const sliceX = Math.round((imgRenderW / gridSize) * correctCol);
      const sliceY = Math.round((imgRenderH / gridSize) * correctRow);

      const panResponder = createPanResponder(tileObj);

      return (
        <Animated.View
          key={tileObj.id}
          {...panResponder.panHandlers}
          style={[
            styles.tileAbsolute,
            {
              width: size,
              height: size,
              left: x,
              top: y,
              zIndex: tileObj.id === dragInfoRef.current.draggingId ? 999 : 1,
              transform: tileObj.anim.getTranslateTransform(),
            },
          ]}
        >
          <View style={styles.tileInner}>
            <Image
              source={image}
              style={{
                position: "absolute",
                left: -sliceX,
                top: -sliceY,
                width: imgRenderW,
                height: imgRenderH,
              }}
            />
          </View>
        </Animated.View>
      );
    });
  };

  // ---------- Level controls ----------
  const nextLevel = () => {
    clearTimer();
    if (level >= 9) {
      // Completed all 10 levels - keep user here or exit
      setLevelComplete(false);
      // optionally reset difficulty or navigate away
      return;
    }
    setLevel((p) => p + 1);
    setLevelComplete(false);
    setGameOver(false);
    setTiles([]);
    // timer and puzzle regeneration handled by effects
  };

  const restartLevel = () => {
    clearTimer();
    setGameOver(false);
    setLevelComplete(false);
    setTiles([]);
    // regenerate puzzle and restart timer via effects
    setTimeout(() => {
      setTimeLeft(DIFFICULTY_SETTINGS[difficulty].time);
      generatePuzzle();
      // restart timer
      clearTimer();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 80);
  };

  // Back handler (go to index.jsx)
  const onBack = () => {
    clearTimer();
    router.back();
  };

  // ---------- UI ----------
  return (
    <View style={styles.screen}>
      {!difficulty ? (
        <View style={styles.centerOverlay}>
          <Text style={[styles.bigTitle, { fontFamily: "Gilroy-Bold" }]}>Focus Dash</Text>
          <Text style={[styles.subtitle, { fontFamily: "Gilroy-Regular" }]}>Improve concentration with quick mini puzzles</Text>

          <View style={{ marginTop: 20 }}>
            {Object.keys(DIFFICULTY_SETTINGS).map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.diffBtn}
                onPress={() => startDifficulty(d)}
              >
                <Text style={[styles.diffLabel, { fontFamily: "Gilroy-Bold" }]}>{d.toUpperCase()}</Text>
                <Text style={[styles.diffMeta, { fontFamily: "Gilroy-Regular" }]}>
                  {DIFFICULTY_SETTINGS[d].grid}×{DIFFICULTY_SETTINGS[d].grid} • {DIFFICULTY_SETTINGS[d].time / 60} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <>
          {/* Header with Back + Info */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
              <Text style={[styles.headerBtnText, { fontFamily: "Gilroy-Bold" }]}>← Back</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity onPress={() => setInfoVisible(true)}  style={styles.infoBtn}>
              <Ionicons name="information-circle-outline" size={30} color="#1A2A4F" />
            </TouchableOpacity>
          </View>

          {/* Title + timer */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { fontFamily: "Gilroy-Bold" }]}>
              Focus Dash — {difficulty.toUpperCase()}
            </Text>
            <Text style={[styles.timer, { fontFamily: "Gilroy-Bold" }]}> {timeLeft}s</Text>
          </View>

          {/* PROGRESS BAR (PB2-B) */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressFill, { width: `${computeProgress()}%` }]} />
            </View>
            <Text style={[styles.progressText, { fontFamily: "Gilroy-Bold" }]}>{computeProgress()}%</Text>
          </View>

          {/* Board container */}
          <View
            style={styles.boardWrapper}
            onLayout={(e) => {
              // use measured width but cap to a max for aesthetics
              const containerWidth = Math.min(windowW - 32, 420);
              setBoardSize(containerWidth);
            }}
          >
            <View style={[styles.board, { width: boardSize, height: boardSize }]}>
              {/* tiles */}
              {renderTiles()}
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {gameOver ? (
              <>
                <Text style={[styles.failText, { fontFamily: "Gilroy-Bold" }]}>Time's up — Try again</Text>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={restartLevel}>
                    <Text style={[styles.primaryText, { fontFamily: "Gilroy-Bold" }]}>Restart Level</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ghostBtn} onPress={() => { clearTimer(); setDifficulty(null); setTiles([]); }}>
                    <Text style={[styles.ghostText, { fontFamily: "Gilroy-Bold" }]}>Exit</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : levelComplete ? (
              <>
                <Text style={[styles.successText, { fontFamily: "Gilroy-Bold" }]}>Level Complete!</Text>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={nextLevel}>
                    <Text style={[styles.primaryText, { fontFamily: "Gilroy-Bold" }]}>{level < 9 ? "Next Level" : "Finish"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ghostBtn} onPress={() => { clearTimer(); setDifficulty(null); setTiles([]); }}>
                    <Text style={[styles.ghostText, { fontFamily: "Gilroy-Bold" }]}>Exit</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.row}>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => generatePuzzle()}>
                  <Text style={[styles.primaryText, { fontFamily: "Gilroy-Bold" }]}>Shuffle</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ghostBtn} onPress={() => { clearTimer(); setDifficulty(null); setTiles([]); }}>
                  <Text style={[styles.ghostText, { fontFamily: "Gilroy-Bold" }]}>Exit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Level complete modal (C1) */}
          

          {/* Info modal */}
          <Modal visible={infoVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Benefits of Focus Dash</Text>
                <Text style={styles.modalSub}>• Improves attention span</Text>
                <Text style={styles.modalSub}>• Trains working memory and visual scanning</Text>
                <Text style={styles.modalSub}>• Reduces mind-wandering and increases mental clarity</Text>
                <Text style={styles.modalSub}> • Quick daily practice supports emotional regulation</Text>
        
                <TouchableOpacity style={[styles.primaryBtn, { marginTop: 18 }]} onPress={() => setInfoVisible(false)}>
                  <Text style={[styles.primaryText, { fontFamily: "Gilroy-Bold" }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

// ------------------- styles -------------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#E8F8E3", padding: 16 },
  centerOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  bigTitle: { fontSize: 36, fontWeight: "100", color: "#043915" },
  subtitle: { color: "#043915", marginTop: 2, textAlign: "center", paddingHorizontal: 20 },

  diffBtn: {
    backgroundColor: "#D9E9CF",
    padding: 14,
    paddingHorizontal: 18,
    marginVertical: 8,
    borderRadius: 12,
    minWidth: 260,
    alignItems: "center",
    shadowColor: "#043915",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.05,
    elevation: 5,
  },
  diffLabel: { fontSize: 16, fontWeight: "700", color: "#043915" },
  diffMeta: { fontSize: 12, color: "#043915", marginTop: 4 },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  headerBtn: { padding: 6, top: 30, left: 5},
  headerBtnText: { fontSize: 18, color: "#043915", fontFamily: "Gilroy-Bold"},

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  headerTitle: { fontSize: 30, fontFamily: "Gilroy-Bold", color: "#043915", marginBottom: 20, paddingTop:40, paddingLeft:15},
  timer: { fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#043915",
    marginBottom: 20, paddingTop:40, paddingRight:15},

  progressWrapper: { marginTop: 1, flexDirection: "row", alignItems: "center", left:5},
  progressBarBg: { flex: 1, height: 15, backgroundColor: "#e9eef5", borderRadius: 10, overflow: "hidden", marginRight: 8 },
  progressFill: { height: 15, backgroundColor: "#043915", borderRadius: 10 },
  progressText: { width: 44, textAlign: "right", fontWeight: "700", color: "#043915", right:5 },

  boardWrapper: { marginTop: 16, alignItems: "center", justifyContent: "center" },
  board: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: BOARD_PADDING,
    position: "relative",
    // width/height dynamic
    shadowColor: "#043915",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.05,
    elevation: 5,
  },

  tileAbsolute: {
    position: "absolute",
  },

  tileInner: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
  },

  controls: { marginTop: 20, alignItems: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingHorizontal: 20 },
  primaryBtn: {
    backgroundColor: "#10243a",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 140,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  ghostBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6eef6",
    marginLeft: 10,
  },
  ghostText: { color: "#274056", fontWeight: "700" },

  failText: { color: "#b00020", fontSize: 16, fontWeight: "700", marginBottom: 8 },
  successText: { color: "#043915", fontSize: 20, fontWeight: "700", marginBottom: 8 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", },
  modalCard: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 16, },
  modalTitle: { fontSize: 22, fontFamily: "Gilroy-Bold", color: "#1A2A4F", textAlign: "center", marginBottom: 15, },
  modalSub: { fontSize: 16,fontFamily: "Gilroy-Regular", color: "#34506E", marginVertical: 5, },
  infoBtn: { position: "absolute", top: 30, right: 5, color:"#043915"},
});
