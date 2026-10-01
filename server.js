const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function validateStudent(data) {
  const { student_id, name, email, phone, course, department, semester } = data;

  if (!student_id || !name || !email || !phone || !course || !department || !semester) {
    return "All required fields are mandatory.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }
  if (!/^\d{10}$/.test(phone)) {
    return "Phone number must contain exactly 10 digits.";
  }
  if (Number(semester) < 1 || Number(semester) > 12) {
    return "Semester must be between 1 and 12.";
  }
  return null;
}

app.get("/api/students", (req, res) => {
  const q = (req.query.q || "").trim();
  let rows;

  if (q) {
    rows = db.prepare(`
      SELECT * FROM students
      WHERE student_id LIKE ?
         OR name LIKE ?
         OR email LIKE ?
         OR department LIKE ?
         OR course LIKE ?
      ORDER BY id DESC
    `).all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  } else {
    rows = db.prepare("SELECT * FROM students ORDER BY id DESC").all();
  }

  res.json(rows);
});

app.get("/api/students/:id", (req, res) => {
  const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found." });
  res.json(student);
});

app.post("/api/students", (req, res) => {
  const error = validateStudent(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const s = req.body;
    const result = db.prepare(`
      INSERT INTO students
      (student_id, name, email, phone, course, department, semester, dob)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      s.student_id, s.name.trim(), s.email.trim(), s.phone.trim(),
      s.course.trim(), s.department.trim(), Number(s.semester), s.dob || null
    );

    res.status(201).json({
      message: "Student added successfully.",
      id: result.lastInsertRowid
    });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "Student ID or email already exists." });
    }
    res.status(500).json({ error: "Database error." });
  }
});

app.put("/api/students/:id", (req, res) => {
  const error = validateStudent(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const s = req.body;
    const result = db.prepare(`
      UPDATE students SET
        student_id = ?, name = ?, email = ?, phone = ?,
        course = ?, department = ?, semester = ?, dob = ?
      WHERE id = ?
    `).run(
      s.student_id, s.name.trim(), s.email.trim(), s.phone.trim(),
      s.course.trim(), s.department.trim(), Number(s.semester), s.dob || null,
      req.params.id
    );

    if (!result.changes) return res.status(404).json({ error: "Student not found." });
    res.json({ message: "Student updated successfully." });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "Student ID or email already exists." });
    }
    res.status(500).json({ error: "Database error." });
  }
});

app.delete("/api/students/:id", (req, res) => {
  const result = db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: "Student not found." });
  res.json({ message: "Student deleted successfully." });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Student Management Portal running at http://localhost:${PORT}`);
});
