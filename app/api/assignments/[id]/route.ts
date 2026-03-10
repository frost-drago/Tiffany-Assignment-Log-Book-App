import { NextResponse } from "next/server";
import { assignments, AssignmentStatus } from "@/lib/data";

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get assignment detail
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment fetched successfully
 *       404:
 *         description: Assignment not found
 *   put:
 *     summary: Update assignment
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Assignment not found
 *   delete:
 *     summary: Delete assignment
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 */

const validStatuses: AssignmentStatus[] = [
  "pending",
  "in_progress",
  "completed",
];

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const numericId = Number(id);

  const assignment = assignments.find((item) => item.id === numericId);

  if (!assignment) {
    return NextResponse.json(
      { message: "Assignment not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      message: "Assignment fetched successfully",
      data: assignment,
    },
    { status: 200 },
  );
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const numericId = Number(id);

  const index = assignments.findIndex((item) => item.id === numericId);

  if (index === -1) {
    return NextResponse.json(
      { message: "Assignment not found" },
      { status: 404 },
    );
  }

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

    assignments[index] = {
      ...assignments[index],
      title,
      course,
      description,
      deadline,
      status,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: "Assignment updated successfully",
        data: assignments[index],
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const numericId = Number(id);

  const index = assignments.findIndex((item) => item.id === numericId);

  if (index === -1) {
    return NextResponse.json(
      { message: "Assignment not found" },
      { status: 404 },
    );
  }

  assignments.splice(index, 1);

  return NextResponse.json(
    { message: "Assignment deleted successfully" },
    { status: 200 },
  );
}
