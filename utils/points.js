import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys
const POINTS_KEY = "totalPoints";

const JOURNAL_DATE_KEY = "journalLastDate";
const JOURNAL_FIRST_KEY = "journalFirstEntryGiven"; // boolean

const GAME_DATE_KEY = "gameLastDate";
const GAME_FIRST_KEY = "gameFirstPointsGiven"; // boolean

// ---------------------------
// GET TOTAL POINTS
// ---------------------------
export async function getPoints() {
  const pts = await AsyncStorage.getItem(POINTS_KEY);
  return pts ? parseInt(pts) : 0;
}

// ---------------------------
// ADD POINTS (COMMON)
// ---------------------------
async function addPoints(amount) {
  const current = await getPoints();
  const updated = current + amount;
  await AsyncStorage.setItem(POINTS_KEY, updated.toString());
  return updated;
}

// =============================================================
// 🟦 JOURNAL POINT LOGIC
// =============================================================
export async function addJournalPoints(wordCount) {

  // 1️⃣ Word count check
  if (wordCount < 20) {
    console.log("No points: Journal < 20 words");
    return await getPoints();
  }

  const today = new Date().toDateString();
  const lastJournal = await AsyncStorage.getItem(JOURNAL_DATE_KEY);
  const firstGiven = await AsyncStorage.getItem(JOURNAL_FIRST_KEY);

  let reward = 0;

  // NEW DAY → first attempt should give 10 points
  if (lastJournal !== today) {
    reward = 10;

    await AsyncStorage.setItem(JOURNAL_DATE_KEY, today);
    await AsyncStorage.setItem(JOURNAL_FIRST_KEY, "true");
  } 
  else {
    // SAME DAY → check if first or repeated
    if (firstGiven === "true") {
      reward = 5; // repeated save
    } else {
      reward = 10; // rare fallback
      await AsyncStorage.setItem(JOURNAL_FIRST_KEY, "true");
    }
  }

  return await addPoints(reward);
}


// =============================================================
// 🟩 GAME POINT LOGIC
// =============================================================
export async function addGamePoints(isCompleted) {

  if (!isCompleted) {
    console.log("No points: Game not completed");
    return await getPoints();
  }

  const today = new Date().toDateString();
  const lastGame = await AsyncStorage.getItem(GAME_DATE_KEY);
  const firstGiven = await AsyncStorage.getItem(GAME_FIRST_KEY);

  let reward = 0;

  // NEW DAY
  if (lastGame !== today) {
    reward = 5;

    await AsyncStorage.setItem(GAME_DATE_KEY, today);
    await AsyncStorage.setItem(GAME_FIRST_KEY, "true");
  } 
  else {
    // SAME DAY → second or more attempt
    reward = 2;
  }

  return await addPoints(reward);
}


// =============================================================
// 🟨 MILESTONE CHECK
// =============================================================
export function checkMilestone(totalPoints) {
  const milestones = [75, 500, 1000, 1750];
  return milestones.find(m => m <= totalPoints && totalPoints - m < 20);
}
