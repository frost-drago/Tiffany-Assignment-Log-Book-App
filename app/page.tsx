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

export default function HomePage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "create",
  });
  const [loading, setLoading] = useState(false);

  async function fetchAssignments() {
    try {
      const response = await fetch("/api/assignments");
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "Failed to create assignment");
        return;
      }

      setForm({
        title: "",
        description: "",
        dueDate: "",
        status: "create",
      });

      await fetchAssignments();
    } catch (error) {
      console.error("Failed to submit assignment:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Assignment Log Book App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
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

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 16px" }}
        >
          {loading ? "Saving..." : "Add Assignment"}
        </button>
      </form>

      <section>
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
            </div>
          ))
        )}
      </section>
    </main>
  );
}
