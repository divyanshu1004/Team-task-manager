import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks");
        setTasks(data);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const now = new Date();

  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const overdue = tasks.filter(
    (t) =>
      t.status !== "Completed" && t.dueDate && new Date(t.dueDate) < now
  ).length;

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page">
      <h2>Welcome, {user?.name} <span className="user-badge">{user?.role}</span></h2>
      <p className="subtitle">Here's your task overview</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="bento-grid">
        <div className="bento-card bento-large stat-total">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="bento-card stat-blue">
          <div className="stat-number">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="bento-card stat-green">
          <div className="stat-number">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="bento-card stat-yellow">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="bento-card stat-red">
          <div className="stat-number">{overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="card mt-2">
          <h3>Recent Tasks</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.title || "—"}</td>
                  <td>
                    <span className={`status-badge status-${task.status.replace(" ", "-").toLowerCase()}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
