import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Pending", "In Progress", "Completed"];

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create task form
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    dueDate: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Status update
  const [updatingId, setUpdatingId] = useState(null);

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

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      // silent
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setAllUsers(data);
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === "Admin") {
      fetchProjects();
      fetchAllUsers();
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!createForm.title) return setError("Title is required");
    if (!createForm.project) return setError("Project is required");
    if (!createForm.dueDate) return setError("Due date is required");

    setCreateLoading(true);
    try {
      const payload = {
        title: createForm.title,
        description: createForm.description,
        project: createForm.project,
        dueDate: createForm.dueDate,
      };
      if (createForm.assignedTo) payload.assignedTo = createForm.assignedTo;

      const { data } = await api.post("/tasks", payload);
      setTasks([data, ...tasks]);
      setCreateForm({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        dueDate: "",
      });
      setShowCreate(false);
      setSuccess("Task created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    setError("");
    setSuccess("");
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? data : t)));
      setSuccess("Status updated");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      setSuccess("Task deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const isOverdue = (task) =>
    task.status !== "Completed" &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tasks</h2>
        {user?.role === "Admin" && (
          <button
            id="create-task-btn"
            className="btn btn-highlight"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? "Cancel" : "+ Create Task"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showCreate && (
        <div className="card mb-2">
          <h3>New Task</h3>
          <form onSubmit={handleCreate} id="create-task-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="task-title">Title *</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Task title"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-project">Project *</label>
                <select
                  id="task-project"
                  value={createForm.project}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, project: e.target.value })
                  }
                  required
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-assigned">Assign To</label>
                <select
                  id="task-assigned"
                  value={createForm.assignedTo}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, assignedTo: e.target.value })
                  }
                >
                  <option value="">— Unassigned —</option>
                  {allUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email}) — {u.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-due">Due Date *</label>
                <input
                  id="task-due"
                  type="date"
                  value={createForm.dueDate}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, dueDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                placeholder="Task description (optional)"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
                rows={2}
              />
            </div>
            <button
              id="create-task-submit"
              type="submit"
              className="btn btn-highlight"
              disabled={createLoading}
            >
              {createLoading ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">No tasks found.</div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  {user?.role === "Admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className={isOverdue(task) ? "row-overdue" : ""}
                  >
                    <td>
                      <div className="task-title">{task.title}</div>
                      {task.description && (
                        <div className="task-desc text-muted">{task.description}</div>
                      )}
                    </td>
                    <td>{task.project?.title || "—"}</td>
                    <td>{task.assignedTo?.name || "Unassigned"}</td>
                    <td>
                      <select
                        id={`status-select-${task._id}`}
                        className="status-select"
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        disabled={
                          updatingId === task._id ||
                          (user?.role !== "Admin" &&
                            task.assignedTo?._id !== user?._id)
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className={isOverdue(task) ? "text-red" : ""}
                    >
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                      {isOverdue(task) && (
                        <span className="overdue-badge"> ⚠ Overdue</span>
                      )}
                    </td>
                    {user?.role === "Admin" && (
                      <td>
                        <button
                          id={`delete-task-${task._id}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
