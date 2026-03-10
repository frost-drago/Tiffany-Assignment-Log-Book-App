import { NextResponse } from "next/server";
import { assignments, AssignmentStatus } from "@/lib/data";

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags:
 *       - Assignments
 *     responses:
 *       200:
 *         description: Assignments fetched successfully
 *   post:
 *     summary: Create a new assignment
 *     tags:
 *       - Assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - course
 *               - deadline
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               course:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 example: 2026-03-10
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Validation error
 */

const validStatuses: AssignmentStatus[] = [
  "pending",
  "in_progress",
  "completed",
];

export async function GET() {
  return NextResponse.json(
    {
      message: "Assignments fetched successfully",
      data: assignments,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, course, description = "", deadline, status } = body;

    if (!title || !course || !deadline || !status) {
      return NextResponse.json(
        { message: "title, course, deadline, and status are required" },
        { status: 400 },
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "status must be pending, in_progress, or completed" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    const newAssignment = {
      id: assignments.length ? assignments[assignments.length - 1].id + 1 : 1,
      title,
      course,
      description,
      deadline,
      status,
      createdAt: now,
      updatedAt: now,
    };

    assignments.push(newAssignment);

    return NextResponse.json(
      {
        message: "Assignment created successfully",
        data: newAssignment,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
