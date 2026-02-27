import { useState } from "react";
import { Button, Text, View, ScrollView } from "react-native";

const API_BASE = "http://127.0.0.1:8000";

type WorkoutItem = { exercise_id: string; reps: number };
type WorkoutResponse = { at: string; items: WorkoutItem[] };

export default function Index() {
  const [workout, setWorkout] = useState<WorkoutResponse | null>(null);
  const [history, setHistory] = useState<WorkoutResponse[]>([]);
  const [status, setStatus] = useState<string>("");

  const generateWorkout = async () => {
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/generate_workout`);
      const data = (await res.json()) as WorkoutResponse;
      setWorkout(data);
      setStatus("Generated.");
    } catch (e) {
      setStatus("Generate error: " + String(e));
    }
  };

  const recordWorkout = async () => {
    if (!workout) {
      setStatus("Nothing to record.");
      return;
    }

    try {
      await fetch(`${API_BASE}/record_workout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: workout.items,
          at: workout.at,
        }),
      });

      // local
      setHistory((prev) => [workout, ...prev]);
      setWorkout(null);
      setStatus("Workout recorded.");
    } catch (e) {
      setStatus("Record error: " + String(e));
    }
  };

  const formatRow = (w: WorkoutResponse) => {
    const date = new Date(w.at);
    const day = date.toLocaleDateString(undefined, { weekday: "short" });
    const time = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    const exercises = w.items.map((i) => i.exercise_id).join(", ");
    return `${day} ${time}: ${exercises}`;
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Generate workout" onPress={generateWorkout} />
      <Button title="Record workout" onPress={recordWorkout} />

      <Text style={{ marginVertical: 10 }}>{status}</Text>

      {workout && (
        <Text selectable style={{ marginBottom: 20 }}>
          {JSON.stringify(workout, null, 2)}
        </Text>
      )}

      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>History</Text>

      <ScrollView>
        {history.map((w, idx) => (
          <Text key={idx} style={{ marginBottom: 5 }}>
            {formatRow(w)}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}