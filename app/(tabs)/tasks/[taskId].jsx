// app/(tabs)/tasks/[taskId].jsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------- IMPORT ALL TASK COMPONENTS ----------
import SpreadKindness from "../../../components/tasks/SpreadKindness";
import CelebrateWin from "../../../components/tasks/CelebrateWin";
import ReachOut from "../../../components/tasks/ReachOut";
import MicroCall from "../../../components/tasks/MicroCall";
import GratitudePeople from "../../../components/tasks/GratitudePeople";
import CozyRitual from "../../../components/tasks/CozyRitual";
import BarrierReflect from "../../../components/tasks/BarrierReflect";
import GratitudeLetter from "../../../components/tasks/GratitudeLetter";
import PayItForward from "../../../components/tasks/PayItForward";
import GratitudePhoto from "../../../components/tasks/GratitudePhoto";
import GratitudeReflect from "../../../components/tasks/GratitudeReflect";
import GratitudeBreath from "../../../components/tasks/GratitudeBreath";
import ShareJoy from "../../../components/tasks/ShareJoy";
import SavorPhoto from "../../../components/tasks/SavourPhoto";
import GratitudeMicrolist from "../../../components/tasks/GratitudeMicroList";
import BoxBreathing from "../../../components/tasks/BoxBreathing";
import MicroGratitude from "../../../components/tasks/MicroGratitude";
import FutureSelf from "../../../components/tasks/FutureSelf";
import MemoryBox from "../../../components/tasks/MemoryBox";
import Grounding from "../../../components/tasks/Grounding";
import RealityCheck from "../../../components/tasks/RealityCheck";
import FocusReset from "../../../components/tasks/FocusReset";
import WorryParking from "../../../components/tasks/WorryParking";
import ProgressiveRelaxation from "../../../components/tasks/ProgressiveRelaxation";
import ControlList from "../../../components/tasks/ControlList";
import TaskSuccess from "../../../components/tasks/TaskSuccess";
import WriteItOut from "../../../components/tasks/WriteItOut";
import PerspectiveShift from "../../../components/tasks/PerspectiveShift";
import SafeVoice from "../../../components/tasks/SafeVoice";
import ProblemSolve from "../../../components/tasks/ProblemSolve";
import FutureSelfNote from "../../../components/tasks/FutureSelfNote";
import SmallGoalStep from "../../../components/tasks/SmallGoalStep";
import HopeAffirmation from "../../../components/tasks/HopeAffirmation";
import ProgressLog from "../../../components/tasks/ProgressLog";
import GratitudeProgress from "../../../components/tasks/GratitudeProgress";
import SelfCompassion from "../../../components/tasks/SelfCompassion";
import RepairChecklist from "../../../components/tasks/RepairChecklist";
import GuiltReframer from "../../../components/tasks/GuiltReframer";
import UnsentLetter from "../../../components/tasks/UnsentLetter";
import SelfForgiveness from "../../../components/tasks/SelfForgiveness";
import ProsCons from "../../../components/tasks/ProsCons";
import ValuesCheck from "../../../components/tasks/ValuesCheck";
import AdviceToFriend from "../../../components/tasks/AdviceToFriend";
import FutureProjection from "../../../components/tasks/FutureProjection";
import ListWorriesBenefits from "../../../components/tasks/WorriesBenefits";

export default function TaskRunner() {
  const { taskId } = useLocalSearchParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load username
  const readUsername = async () => {
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
      return username?.trim() ?? null;
    } catch {
      return null;
    }
  };

  // Load task
  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const username = await readUsername();
      if (!username) return setLoading(false);

      console.log("📌 Fetching task:", taskId);

      const resp = await fetch(
        `http://192.168.29.215:5010/get-task?task_id=${taskId}&username=${username}`
      );

      const data = await resp.json();
      console.log("📌 Loaded task:", data);

      setTask(data.task ?? null);
    } catch (e) {
      console.log("❌ loadTask error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Complete task
  const markComplete = async () => {
    console.log("🔥 markComplete CALLED!");

    try {
      const username = await readUsername();

      const payload = {
        username,
        task_id: task.id,
      };

      console.log("📤 Sending:", payload);

      const resp = await fetch("http://192.168.29.215:5010/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      console.log("📥 Completed:", json);

      router.replace({
        pathname: "/tasks",
        params: {
          refresh: "1",
          reward: JSON.stringify(json),
        },
      });
    } catch (e) {
      console.log("❌ Complete task error:", e);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (!task) return <View />;

  const wrap = (Component) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Component task={task} onComplete={markComplete} />
    </GestureHandlerRootView>
  );
  // Task rendering switch
  switch (task.id) {
    // HAPPY
    case "happy_spread_kindness":
      return wrap(SpreadKindness);
    case "happy_share_joy":
      return wrap(ShareJoy);
    case "happy_celebrate_win":
      return wrap(CelebrateWin);
    case "happy_savor_photo":
      return wrap(SavorPhoto);
    case "happy_gratitude_microlist":
      return wrap(GratitudeMicrolist);

    // LONELY
    case "lonely_reachout":
      return wrap(ReachOut);
    case "lonely_micro_call":
      return wrap(MicroCall);
    case "lonely_gratitude_people":
      return wrap(GratitudePeople);
    case "lonely_cozy_ritual":
      return wrap(CozyRitual);
    case "lonely_barrier_reflect":
      return wrap(BarrierReflect);

    // GRATEFUL
    case "grateful_letter":
      return wrap(GratitudeLetter);
    case "grateful_pay_forward":
      return wrap(PayItForward);
    case "grateful_photo":
      return wrap(GratitudePhoto);
    case "grateful_reflect":
      return wrap(GratitudeReflect);
    case "grateful_breath":
      return wrap(GratitudeBreath);

    // SAD
    case "sad_breathing":
      return wrap(BoxBreathing);
    case "sad_connect":
      return wrap(ReachOut);
    case "sad_micro_gratitude":
      return wrap(MicroGratitude);
    case "sad_future_self":
      return wrap(FutureSelf);
    case "sad_memory_box":
      return wrap(MemoryBox);

    // ANXIOUS
    case "anx_54321":
      return wrap(Grounding);
    case "anx_box_breath":
      return wrap(BoxBreathing);
    case "anx_reality_check":
      return wrap(RealityCheck);
    case "anx_pomodoro":
      return wrap(FocusReset);
    case "anx_worry_parking":
      return wrap(WorryParking);

    // STRESSED
    case "stress_relaxation":
      return wrap(ProgressiveRelaxation);
    case "stress_ask_help":
      return wrap(ReachOut);
    case "stress_breathing":
      return wrap(BoxBreathing);
    case "stress_control_list":
      return wrap(ControlList);
    case "stress_visualization":
      return wrap(TaskSuccess);

    // ANGRY
    case "angry_breath":
      return wrap(BoxBreathing);
    case "angry_write":
      return wrap(WriteItOut);
    case "angry_reframe":
      return wrap(PerspectiveShift);
    case "angry_safe_expression":
      return wrap(SafeVoice);
    case "angry_problem_solve":
      return wrap(ProblemSolve);

    // HOPEFUL
    case "hope_future_self":
      return wrap(FutureSelfNote);
    case "hope_small_goal":
      return wrap(SmallGoalStep);
    case "hope_affirm":
      return wrap(HopeAffirmation);
    case "hope_progress_log":
      return wrap(ProgressLog);
    case "hope_gratitude_progress":
      return wrap(GratitudeProgress);

    // GUILT
    case "guilt_self_compassion":
      return wrap(SelfCompassion);
    case "guilt_repair_step":
      return wrap(RepairChecklist);
    case "guilt_reframe":
      return wrap(GuiltReframer);
    case "guilt_unsent_letter":
      return wrap(UnsentLetter);
    case "guilt_forgiveness":
      return wrap(SelfForgiveness);

    // CONFLICTED
    case "conflict_pros_cons":
      return wrap(ProsCons);
    case "conflict_values_check":
      return wrap(ValuesCheck);
    case "conflict_friend_advice":
      return wrap(AdviceToFriend);
    case "conflict_future_projection":
      return wrap(FutureProjection);
    case "conflict_list_worries":
      return wrap(ListWorriesBenefits);

    default:
      return <View />;
  }
}
