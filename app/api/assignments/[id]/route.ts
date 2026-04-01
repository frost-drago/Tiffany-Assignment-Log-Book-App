//app/api/assignments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get assignment detail by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment detail
 *       404:
 *         description: Assignment not found
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const assignmentId = Number(id);

    if (Number.isNaN(assignmentId)) {
      return NextResponse.json(
        { message: "Invalid assignment id" },
        { status: 400 },
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(assignment, { status: 200 });
  } catch (error) {
    console.error("GET /api/assignments/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to fetch assignment" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/assignments/{id}:
 *   put:
 *     summary: Update assignment by id
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [create, on process, submitted]
 *     responses:
 *       200:
 *         description: Assignment updated
 *       404:
 *         description: Assignment not found
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const assignmentId = Number(id);

    if (Number.isNaN(assignmentId)) {
      return NextResponse.json(
        { message: "Invalid assignment id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { title, description, dueDate, status } = body;

    if (!title || !description || !dueDate || !status) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const allowedStatuses = ["create", "on process", "submitted"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 },
      );
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status,
      },
    });

    return NextResponse.json(updatedAssignment, { status: 200 });
  } catch (error) {
    console.error("PUT /api/assignments/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update assignment" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/assignments/{id}:
 *   delete:
 *     summary: Delete assignment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment deleted
 *       404:
 *         description: Assignment not found
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const assignmentId = Number(id);

    if (Number.isNaN(assignmentId)) {
      return NextResponse.json(
        { message: "Invalid assignment id" },
        { status: 400 },
      );
    }

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 },
      );
    }

    await prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return NextResponse.json(
      { message: "Assignment deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/assignments/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to delete assignment" },
      { status: 500 },
    );
  }
}
