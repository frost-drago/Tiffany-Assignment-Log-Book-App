import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     responses:
 *       200:
 *         description: List of assignments
 */
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: {
        assignmentDate: "desc",
      },
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("GET /api/assignments error:", error);

    return NextResponse.json(
      { message: "Failed to fetch assignments" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create a new assignment
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
 *       201:
 *         description: Assignment created
 */
export async function POST(request: NextRequest) {
  try {
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

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("POST /api/assignments error:", error);

    return NextResponse.json(
      { message: "Failed to create assignment" },
      { status: 500 },
    );
  }
}
