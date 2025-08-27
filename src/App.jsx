import { useState, useEffect } from "react";

const GAS_URL = "https://script.google.com/macros/s/AKfycbykGQhqNv-wSqAdcnnENI-fbnOmQwK3RkK6gbeQ98H9ZRXwatYIuGU5bNmyVl8csLUEvg/exec"; // thay YOUR_WEBAPP_ID bằng ID WebApp của mày

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");

  // Hàm fetch chung
  const callGAS = async (action, payload = {}) => {
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      return await res.json();
    } catch (err) {
      console.error("Error fetching GAS:", err);
      return { error: err.message };
    }
  };

  // Load dữ liệu lúc đầu
  useEffect(() => {
    const init = async () => {
      const data = await callGAS("getInitData");
      if (!data.error) setTasks(data.tasks || []);
    };
    init();
  }, []);

  const handleAddTask = async () => {
    if (!newTask) return;
    const data = await callGAS("addTask", { taskText: newTask, deadlineStr: deadline });
    if (!data.error) {
      setTasks((prev) => [...prev, data.result]);
      setNewTask("");
      setDeadline("");
    }
  };

  const handleMarkDone = async (id) => {
    const data = await callGAS("markDone", { id });
    if (!data.error) {
      setTasks((prev) => prev.map(t => t.id === id ? { ...t, done: true } : t));
    }
  };

  const handleSavePrompt = async () => {
    if (!prompt) return;
    await callGAS("savePrompt", { prompt });
    alert("Prompt saved!");
  };

  const handleSaveEmail = async () => {
    if (!email) return;
    await callGAS("saveRecipientEmail", { email });
    alert("Email saved!");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>My Tasks App</h1>

      <div>
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Task" />
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.text} - {t.deadline} - {t.done ? "✅" : "❌"}
            {!t.done && <button onClick={() => handleMarkDone(t.id)}>Done</button>}
          </li>
        ))}
      </ul>

      <div>
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt" />
        <button onClick={handleSavePrompt}>Save Prompt</button>
      </div>

      <div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Recipient Email" />
        <button onClick={handleSaveEmail}>Save Email</button>
      </div>
    </div>
  );
}
