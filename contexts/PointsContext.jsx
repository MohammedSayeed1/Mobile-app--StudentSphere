import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PointsContext = createContext();
export const usePoints = () => useContext(PointsContext);

const POINTS_KEY = "APP_POINTS_TOTAL";
const JOURNAL_META_KEY = "APP_JOURNAL_META"; // store { date: 'YYYY-MM-DD', count: number }

const getTodayISO = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [journalMeta, setJournalMeta] = useState({ date: null, count: 0 });

  useEffect(() => {
    // load from storage on mount
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(POINTS_KEY);
        const total = raw ? parseInt(raw, 10) : 0;
        setPoints(total || 0);

        const metaRaw = await AsyncStorage.getItem(JOURNAL_META_KEY);
        const meta = metaRaw ? JSON.parse(metaRaw) : { date: null, count: 0 };
        setJournalMeta(meta);
      } catch (e) {
        console.warn("PointsProvider load error", e);
      }
    })();
  }, []);

  const persistPoints = async (newTotal) => {
    setPoints(newTotal);
    try {
      await AsyncStorage.setItem(POINTS_KEY, String(newTotal));
    } catch (e) {
      console.warn("persistPoints error", e);
    }
  };

  const persistJournalMeta = async (meta) => {
    setJournalMeta(meta);
    try {
      await AsyncStorage.setItem(JOURNAL_META_KEY, JSON.stringify(meta));
    } catch (e) {
      console.warn("persistJournalMeta error", e);
    }
  };

  /**
   * Call when user saved a journal with >=20 words.
   * Returns how many points were awarded (10 or 5).
   */
  const awardJournalPoints = async () => {
    const today = getTodayISO();
    let award = 5;
    let { date, count } = journalMeta || { date: null, count: 0 };

    if (date !== today) {
      // first journal today
      award = 10;
      date = today;
      count = 1;
    } else {
      // additional today
      award = 5;
      count = (count || 0) + 1;
    }

    const newTotal = (points || 0) + award;
    await persistPoints(newTotal);
    await persistJournalMeta({ date, count });

    return award;
  };

  const resetJournalMeta = async () => {
    await persistJournalMeta({ date: null, count: 0 });
  };

  const addPoints = async (n) => {
    const newTotal = (points || 0) + n;
    await persistPoints(newTotal);
    return newTotal;
  };

  return (
    <PointsContext.Provider value={{ points, awardJournalPoints, addPoints, resetJournalMeta }}>
      {children}
    </PointsContext.Provider>
  );
};
