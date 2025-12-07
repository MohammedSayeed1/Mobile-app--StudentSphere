// utils/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function readUsername() {
  try {
    let username = await AsyncStorage.getItem("username");
    if (!username) {
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          username = parsed?.username ?? parsed?.name ?? null;
        } catch {
          username = raw;
        }
      }
    }
    return username && username !== "null" ? String(username).trim() : null;
  } catch (e) {
    return null;
  }
}

export async function completeTaskRequest(task_id) {
  const username = await readUsername();
  const resp = await fetch("http://192.168.29.215:5010/complete-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, task_id }),
  });

  return await resp.json();
}
