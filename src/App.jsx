// src/App.jsx
import React, { useState, useEffect } from "react";

const GAS_URL = "https://script.google.com/macros/s/AKfycbykGQhqNv-wSqAdcnnENI-fbnOmQwK3RkK6gbeQ98H9ZRXwatYIuGU5bNmyVl8csLUEvg/exec"; // thay bằng link của mày

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch dữ liệu từ Apps Script
  const fetchTasks = async () => {
    try {
      const res = await fetch(GAS_URL, {
        method: "GET",
        mode: "cors", // đảm bảo CORS
      });
      if (!res.ok) throw new Error("Failed to fetch from GAS");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>My WebApp</h1>
      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}
      <ul style={styles.list}>
        {tasks.map((task, idx) => (
          <li key={idx} style={styles.item}>
            {task.name} - {task.deadline}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  root: {
    backgroundColor: "#0b1020",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  info: {
    color: "#ccc",
  },
  error: {
    color: "red",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    backgroundColor: "#111831",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
  },
};

export default App;
