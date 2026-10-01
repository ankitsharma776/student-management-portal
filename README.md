# Student Management Portal

A full-stack Student Management Portal created as a practical virtual internship project.

## Features

- Responsive web interface
- SQLite database integration
- CRUD operations
- Student search
- Form validation
- Unique Student ID and email
- Edit and delete confirmation
- Dashboard statistics
- REST API

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- SQLite using better-sqlite3

## Requirements

- Node.js 22.x recommended
- VS Code

## Run Project

Open the project folder in VS Code terminal:

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## API Endpoints

- GET `/api/students`
- GET `/api/students/:id`
- POST `/api/students`
- PUT `/api/students/:id`
- DELETE `/api/students/:id`
- GET `/api/students?q=search`

## Workflow

1. User opens portal.
2. User enters student details.
3. Frontend validates required data.
4. Data is sent to Express REST API.
5. Server validates the request.
6. SQLite stores the student record.
7. Student records are displayed in the table.
8. User can search, edit, or delete records.

## Testing Checklist

- Add valid student
- Try empty required field
- Try invalid email
- Try invalid phone number
- Try duplicate Student ID
- Search student
- Edit student
- Delete student
- Refresh page and verify database persistence

## Project Outcome

A working student management portal demonstrating frontend development, backend REST APIs, database integration, CRUD operations, search, validation, and responsive design.
