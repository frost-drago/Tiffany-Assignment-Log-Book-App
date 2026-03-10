export type AssignmentStatus = "pending" | "in_progress" | "completed";

export type Assignment = {
  id: number;
  title: string;
  course: string;
  description: string;
  deadline: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
};

export const assignments: Assignment[] = [
  {
    id: 1,
    title: "Finish REST API assignment",
    course: "WADS",
    description: "Build CRUD API using Next.js",
    deadline: "2026-03-10",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
