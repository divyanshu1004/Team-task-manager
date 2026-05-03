import React, { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  status: string;
  dueDate: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        // Using a mock project ID or a global task route
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 border rounded shadow">
              <h3 className="font-semibold">{task.title}</h3>
              <p>Status: {task.status}</p>
              <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
