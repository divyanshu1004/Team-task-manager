import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create project form
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", description: "" });
  const [createLoading, setCreateLoading] = useState(false);

  // Add member
  const [memberProjectId, setMemberProjectId] = useState(null);
  const [memberUserId, setMemberUserId] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setAllUsers(data);
    } catch (err) {
      // silent — only Admins see this
    }
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role === "Admin") fetchAllUsers();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!createForm.title) {
      setError("Title is required");
      return;
    }
    setCreateLoading(true);
    try {
      const { data } = await api.post("/projects", createForm);
      setProjects([data, ...projects]);
      setCreateForm({ title: "", description: "" });
      setShowCreate(false);
      setSuccess("Project created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddMember = async (projectId) => {
    if (!memberUserId) {
      setError("Please select a user");
      return;
    }
    setError("");
    setSuccess("");
    setMemberLoading(true);
    try {
      const { data } = await api.put(`/projects/${projectId}/add-member`, {
        userId: memberUserId,
      });
      setProjects(projects.map((p) => (p._id === projectId ? data : p)));
      setMemberUserId("");
      setMemberProjectId(null);
      setSuccess("Member added successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setMemberLoading(false);
    }
  };

  // Users not already in this project
  const availableUsers = (project) =>
    allUsers.filter(
      (u) => !project.members?.some((m) => m._id === u._id)
    );

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Projects</h2>
        {user?.role === "Admin" && (
          <button
            id="create-project-btn"
            className="btn btn-highlight"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? "Cancel" : "+ Create Project"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showCreate && (
        <div className="card mb-2">
          <h3>New Project</h3>
          <form onSubmit={handleCreate} id="create-project-form">
            <div className="form-group">
              <label htmlFor="proj-title">Title *</label>
              <input
                id="proj-title"
                type="text"
                placeholder="Project title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj-desc">Description</label>
              <textarea
                id="proj-desc"
                placeholder="Project description (optional)"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <button
              id="create-project-submit"
              type="submit"
              className="btn btn-highlight"
              disabled={createLoading}
            >
              {createLoading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">No projects found.</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => {
            const available = availableUsers(project);
            return (
              <div key={project._id} className="card">
                <h3>{project.title}</h3>
                {project.description && (
                  <p className="text-muted">{project.description}</p>
                )}
                <p className="text-sm mt-1">
                  <strong>Created by:</strong>{" "}
                  {project.createdBy?.name || "Unknown"}
                </p>
                <div className="members-section">
                  <strong>Members ({project.members?.length || 0}):</strong>
                  <div className="members-list">
                    {project.members?.map((m) => (
                      <span key={m._id} className="member-chip">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>

                {user?.role === "Admin" && (
                  <div className="mt-1">
                    {memberProjectId === project._id ? (
                      <div className="inline-form">
                        <select
                          id={`member-select-${project._id}`}
                          value={memberUserId}
                          onChange={(e) => setMemberUserId(e.target.value)}
                          className="member-select"
                        >
                          <option value="">— Select a user —</option>
                          {available.length === 0 ? (
                            <option disabled>All users already added</option>
                          ) : (
                            available.map((u) => (
                              <option key={u._id} value={u._id}>
                                {u.name} ({u.email}) — {u.role}
                              </option>
                            ))
                          )}
                        </select>
                        <button
                          id={`add-member-submit-${project._id}`}
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddMember(project._id)}
                          disabled={memberLoading || !memberUserId}
                        >
                          {memberLoading ? "Adding..." : "Add"}
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setMemberProjectId(null);
                            setMemberUserId("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`add-member-btn-${project._id}`}
                        className="btn btn-outline btn-sm"
                        onClick={() => setMemberProjectId(project._id)}
                      >
                        + Add Member
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
