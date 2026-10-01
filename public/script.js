const form = document.getElementById("studentForm");
const message = document.getElementById("message");

async function loadStudents() {
  const q = document.getElementById("search").value.trim();
  const response = await fetch(`/api/students?q=${encodeURIComponent(q)}`);
  const students = await response.json();

  document.getElementById("studentTable").innerHTML = students.length
    ? students.map(s => `
      <tr>
        <td>${escapeHtml(s.student_id)}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.phone)}</td>
        <td>${escapeHtml(s.course)}</td>
        <td>${escapeHtml(s.department)}</td>
        <td>${s.semester}</td>
        <td class="actions">
          <button class="edit" onclick="editStudent(${s.id})">Edit</button>
          <button class="delete" onclick="deleteStudent(${s.id})">Delete</button>
        </td>
      </tr>
    `).join("")
    : `<tr><td colspan="8">No students found.</td></tr>`;

  updateStats(students);
}

function updateStats(students) {
  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("totalDepartments").textContent =
    new Set(students.map(s => s.department)).size;
  document.getElementById("totalCourses").textContent =
    new Set(students.map(s => s.course)).size;
}

function getFormData() {
  return {
    student_id: document.getElementById("student_id").value.trim(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    course: document.getElementById("course").value.trim(),
    department: document.getElementById("department").value.trim(),
    semester: document.getElementById("semester").value,
    dob: document.getElementById("dob").value
  };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = getFormData();
  const id = document.getElementById("recordId").value;
  const method = id ? "PUT" : "POST";
  const url = id ? `/api/students/${id}` : "/api/students";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.error || "Something went wrong.", true);
      return;
    }

    showMessage(result.message);
    resetForm();
    loadStudents();
  } catch {
    showMessage("Server connection failed.", true);
  }
});

async function editStudent(id) {
  const response = await fetch(`/api/students/${id}`);
  const s = await response.json();

  document.getElementById("recordId").value = s.id;
  document.getElementById("student_id").value = s.student_id;
  document.getElementById("name").value = s.name;
  document.getElementById("email").value = s.email;
  document.getElementById("phone").value = s.phone;
  document.getElementById("course").value = s.course;
  document.getElementById("department").value = s.department;
  document.getElementById("semester").value = s.semester;
  document.getElementById("dob").value = s.dob || "";

  document.getElementById("formTitle").textContent = "Edit Student";
  document.getElementById("submitBtn").textContent = "Update Student";
  document.getElementById("cancelBtn").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
  const result = await response.json();

  showMessage(result.message || result.error, !response.ok);
  loadStudents();
}

function resetForm() {
  form.reset();
  document.getElementById("recordId").value = "";
  document.getElementById("formTitle").textContent = "Add Student";
  document.getElementById("submitBtn").textContent = "Add Student";
  document.getElementById("cancelBtn").hidden = true;
}

function showMessage(text, error = false) {
  message.textContent = text;
  message.style.color = error ? "#dc2626" : "#15803d";
  setTimeout(() => message.textContent = "", 3000);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadStudents();
