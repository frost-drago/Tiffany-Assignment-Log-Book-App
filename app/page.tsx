//app/page.tsx
"use client";

import { useEffect, useState } from "react";

type Assignment = {
  id: number;
  title: string;
  description: string;
  assignmentDate: string;
  dueDate: string;
  status: string;
};

type FormState = {
  title: string;
  description: string;
  dueDate: string;
  status: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  dueDate: "",
  status: "create",
};

export default function HomePage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchAssignments() {
    try {
      const response = await fetch("/api/assignments");
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  }

  async function fetchAssignmentDetail(id: number) {
    setDetailLoading(true);

    try {
      const response = await fetch(`/api/assignments/${id}`);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch assignment detail");
        return;
      }

      setSelectedAssignment(data);
    } catch (error) {
      console.error("Failed to fetch assignment detail:", error);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    fetchAssignments();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleEditClick(assignment: Assignment) {
    setEditingId(assignment.id);
    setForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.slice(0, 10),
      status: assignment.status,
    });
    setSelectedAssignment(assignment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        editingId === null
          ? "/api/assignments"
          : `/api/assignments/${editingId}`;

      const method = editingId === null ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save assignment");
        return;
      }

      setForm(initialForm);

      const updatedId = editingId;
      setEditingId(null);

      await fetchAssignments();

      if (updatedId !== null) {
        await fetchAssignmentDetail(updatedId);
      }
    } catch (error) {
      console.error("Failed to submit assignment:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete assignment");
        return;
      }

      if (selectedAssignment?.id === id) {
        setSelectedAssignment(null);
      }

      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }

      await fetchAssignments();
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  }

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Assignment Log Book App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
        <h2>{editingId === null ? "Add Assignment" : "Edit Assignment"}</h2>

        <div style={{ marginBottom: "12px" }}>
          <label>Assignment Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Assignment Description</label>
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", minHeight: "100px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Due Date</label>
          <br />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            style={{ padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ padding: "8px" }}
          >
            <option value="create">create</option>
            <option value="on process">on process</option>
            <option value="submitted">submitted</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "10px 16px" }}
          >
            {loading
              ? editingId === null
                ? "Saving..."
                : "Updating..."
              : editingId === null
                ? "Add Assignment"
                : "Update Assignment"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{ padding: "10px 16px" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section style={{ marginBottom: "32px" }}>
        <h2>Assignment List</h2>

        {assignments.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p>
                <strong>Assignment Date:</strong>{" "}
                {new Date(assignment.assignmentDate).toLocaleString()}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {assignment.status}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button onClick={() => fetchAssignmentDetail(assignment.id)}>
                  Detail
                </button>
                <button onClick={() => handleEditClick(assignment)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(assignment.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Assignment Detail</h2>

        {detailLoading ? (
          <p>Loading detail...</p>
        ) : !selectedAssignment ? (
          <p>Select an assignment to see the detail.</p>
        ) : (
          <div
            style={{
              border: "1px solid #999",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{selectedAssignment.title}</h3>
            <p>{selectedAssignment.description}</p>
            <p>
              <strong>ID:</strong> {selectedAssignment.id}
            </p>
            <p>
              <strong>Assignment Date:</strong>{" "}
              {new Date(selectedAssignment.assignmentDate).toLocaleString()}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(selectedAssignment.dueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedAssignment.status}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
