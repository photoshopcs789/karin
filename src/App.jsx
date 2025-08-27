import { useEffect, useState } from "react";

const GAS_URL = "https://script.google.com/macros/s/AKfycbwvzes1ISnBDLWa0svQaR9vr6ja5LBXZzrFF6UwstsleRrmZy7P0yR8WbU-FKHAaqFY/exec"; // Thay bằng URL webapp m

async function callGAS(action, payload = {}) {
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action, ...payload })
    });
    if (!res.ok) throw new Error("Network response not ok");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fail to fetch GAS:", err);
    return null;
  }
}

function App() {
  const [initData, setInitData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await callGAS("getInitData");
      setInitData(data);
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Vite + React + GAS</h1>
      <pre>{JSON.stringify(initData, null, 2)}</pre>
    </div>
  );
}

export default App;
