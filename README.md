# YourName Assignment Log Book App

A REST API built with Next.js App Router for managing assignments.

## Features
- View all assignments
- Create new assignment
- View assignment detail
- Update assignment
- Delete assignment
- Swagger API documentation

## API Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/assignments | Get all assignments |
| POST | /api/assignments | Create a new assignment |
| GET | /api/assignments/:id | Get assignment detail |
| PUT | /api/assignments/:id | Update assignment |
| DELETE | /api/assignments/:id | Delete assignment |

## Sample Assignment Object

```json
{
  "id": 1,
  "title": "Finish REST API assignment",
  "course": "WADS",
  "description": "Build CRUD API using Next.js",
  "deadline": "2026-03-10",
  "status": "pending",
  "createdAt": "2026-03-10T10:00:00.000Z",
  "updatedAt": "2026-03-10T10:00:00.000Z"
}