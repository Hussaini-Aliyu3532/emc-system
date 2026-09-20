import { redirectByRole } from "./auth.js";
import { getCases, takeCase, close, postMeeting } from "./servces.js";

export function renderUser(user) {
  const tr = document.createElement("tr");
  tr.dataset.id = user.id;

  const identifier = user.role === "student" ? user.matrix : user.email;

  tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.matrix}</td>
        <td><span class='status ${user.status}'>${user.status}</span></td>
        <td class='action'>
            <button class='delete'>delete</button>
            <button class='edit'>edit</button>
            <button class='toggle'>toggle</button>
        </td>
    `;

  document.querySelector("tbody").append(tr);
}

export function clearTable() {
  document.querySelector("tbody").innerHTML = "";
}

export function openModel() {
  document.querySelector(".overlay").classList.add("active");
  setTimeout(() => {
    document.getElementById("name").focus();
  }, 100);
}

export function closeModel() {
  const password = document.getElementById("password");
  document.querySelector(".overlay").classList.remove("active");
  password.required = true;
  password.placeholder = "";
  document.querySelector(".popForm").reset();
}

export function toggle() {
  document.querySelector(".sidebar").classList.toggle("inactive");
}

export function renderProfile(currentUser) {
  const initials = currentUser.fullName[0].toUpperCase();
  if (document.querySelector(".avatar")) {
    document.querySelector(".avatar").textContent = initials;
  }

  let greeting = "";
  const hour = new Date().getHours();
  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  if (document.querySelector(".welcome")) {
    document.querySelector(".welcome").textContent =
      `${greeting}, ${currentUser.fullName}!`;
  }
}

export function renderAdminDash(users) {
  function renderUser(user) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${user.fullName}</td>
        <td>${user.email ?? user.matrix}</td>
        <td>${user.role}</td>
        <td class='status ${user.status}'>${user.status}</td>
    `;
    document.querySelector("tbody").append(tr);
  }

  function clearTable() {
    document.querySelector("tbody").innerHTML = "";
  }

  async function reloadTable() {
    clearTable();

    users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const recentUsers = users.slice(0, 4);
    recentUsers.forEach(renderUser);

    const totalInvigilators = users.filter(
      (u) => u.role === "invigilator",
    ).length;
    const totalOfficers = users.filter((u) => u.role === "officer").length;
    const activeStudents = users.filter(
      (u) => u.role === "student" && u.status === "active",
    ).length;

    document.querySelector(".invigilator").textContent = totalInvigilators;
    document.querySelector(".officer").textContent = totalOfficers;
    document.querySelector(".active").textContent = activeStudents;
  }
  reloadTable();
}

function reloadOffDashTable(caseItem) {
  const tr = document.createElement("tr");
  tr.dataset.id = caseItem.case_id;

  tr.innerHTML = `
      <td>${caseItem.case_id}</td>
      <td>${caseItem.student_id}</td>
      <td>${caseItem.reported_by}</td>
      <td>${caseItem.exam_date}</td>
      <td><span class='status ${caseItem.status}'>${caseItem.status}</span></td>
      <td class='action'><button class='view'>view</button></td>
    `;

  if (caseItem.assigned_officer) {
    tr.querySelector(".view").classList.add("viewed");
  }

  document.querySelector("tbody").append(tr);

  tr.addEventListener("click", (e) => {
    if (e.target.classList.contains("view")) {
      console.log("btn clicked");
      document.querySelector(".popUp").innerHTML = viewDetail(caseItem);
      document.querySelector(".overlay").classList.add("enable");

      const takeButton = document.getElementById("takeCase");
      if (caseItem.assigned_officer) {
        takeButton.disabled = true;
        takeButton.textContent = "assigned";
        takeButton.style.background = "#878f25";
      } else {
        takeButton.addEventListener("click", () => takeCase(tr.dataset.id));
      }

      document.querySelector(".cancil").addEventListener("click", close);
    }
  });
}

function reloadViewCaseTable(caseItem) {
  const tr = document.createElement("tr");
  tr.dataset.id = caseItem.case_id;
  tr.innerHTML = `
      <td>${caseItem.case_id}</td>
      <td>${caseItem.student_id}</td>
      <td>${caseItem.reported_by}</td>
      <td>${caseItem.exam_date}</td>
      <td><span class='status ${caseItem.status}'>${caseItem.status}</span></td>
      <td class='action'><button class='view'>view</button></td>
  `;

  if (caseItem.assigned_officer) {
    tr.querySelector(".view").classList.add("viewed");
  }

  document.querySelector("tbody").append(tr);
  tr.addEventListener("click", (e) => {
    console.log("row clicked.");

    if (e.target.classList.contains("view")) {
      console.log("btn clicked");
      document.querySelector(".popUp").innerHTML = viewDetail(caseItem);
      document.querySelector(".overlay").classList.add("enable");

      const takeButton = document.getElementById("takeCase");
      if (caseItem.assigned_officer) {
        takeButton.disabled = true;
        takeButton.textContent = "assigned";
        takeButton.style.background = "#878f25";
      } else {
        takeButton.addEventListener("click", () => {
          takeCase(tr.dataset.id);
          location.href = "/emc-system/dashboards/officer/scheduleMeeting.html";
        });
      }

      document.querySelector(".cancil").addEventListener("click", close);
    }
  });
}

function reloadScheduleMeetingTable(caseItem) {
  const tr = document.createElement("tr");
  tr.dataset.id = caseItem.case_id;
  tr.innerHTML = `
      <td>${caseItem.case_id}</td>
      <td>${caseItem.student_id}</td>
      <td>${caseItem.exam_date}</td>
      <td><span class='status ${caseItem.status}'>${caseItem.status}</span></td>
      <td class='action'><button class='view'>view</button></td>
    `;
  document.querySelector("tbody").append(tr);

  if (caseItem.assigned_officer) {
    tr.querySelector('.view').classList.add('viewed');
  }
  if (caseItem.meeting_date) {
    tr.querySelector(".view").style.background = '#a053e8';
    tr.querySelector(".status").style.background = "#ba8ae7";
  }

  tr.addEventListener("click", (e) => {
    if (e.target.classList.contains("view")) {
      document.querySelector(".popUp").innerHTML = viewSchedule(caseItem);
      document.querySelector(".overlay").classList.add("enable");

      document.querySelector(".cancil").addEventListener("click", close);
      const goto = document.getElementById("goto");

      if (caseItem.meeting_date) {
        goto.disabled = true;
        goto.style.background = "#878f25";
      } else {
        goto.addEventListener("click", () => {
          document.querySelector(".popUp").innerHTML = showForm();
          document.querySelector(".overlay").classList.add("enable");

          document.querySelector(".cancil").addEventListener("click", close);

          postMeeting(tr.dataset.id);
        });
      }
    }
  });
}

export async function renderOfficer(cases, currentPage, currentUser) {
  switch (currentPage) {
    case "offDash":
      cases.slice(0, 5).forEach(reloadOffDashTable);
      document
        .querySelector(".bottom button")
        .addEventListener(
          "click",
          () =>
            (location.href = "/emc-system/dashboards/officer/viewCases.html"),
        );
      break;
    case "viewCases":
      cases.forEach(reloadViewCaseTable);
      break;
    case "scheduleMeeting":
      cases
        .filter(
          (cases) =>
            cases.assigned_officer === currentUser.id &&
            cases.status === "under review",
        )
        .forEach(reloadScheduleMeetingTable);
      break;
    case "decision":
      alert("decision");
      break;
    case "settings":
      alert("settings");
      break;
    default:
      redirectByRole(document.body.dataset.role);
  }
}

function reloadMyCasesTable(caseItem) {
  const tr = document.createElement("tr");
  tr.dataset.id = caseItem.case_id;
  tr.innerHTML = `
      <td>${caseItem.case_id}</td>
      <td>${caseItem.student_id}</td>
      <td>${caseItem.exam_date}</td>
      <td>${caseItem.exam_time}</td>
      <td><span class='status ${caseItem.status}'>${caseItem.status}</span></td>
      <td class='action'><button class='view'>view</button></td>
    `;
  document.querySelector("tbody").append(tr);

  if (caseItem.assigned_officer) {
    tr.querySelector(".view").classList.add("viewed");
  }

  tr.addEventListener("click", (e) => {
    if (e.target.classList.contains("view")) {
      document.querySelector(".popUp").innerHTML = viewDetail(caseItem);
      document.querySelector(".overlay").classList.add("enable");

      document.querySelector(".cancil").addEventListener("click", close);
    }
  });
}

export function renderInvigilator(cases, currentPage) {
  switch (currentPage) {
    case "invDash":
      cases.forEach(reloadMyCasesTable);
      break;
    case "reportCases":
      loadFaculties();
      loadDepartments();
      loadCourses();
      break;
    case "myreport":
      cases.forEach(reloadMyCasesTable);
      break;
    case "settings":
      alert("settings");
      break;
    default:
      redirectByRole(document.body.dataset.role);
  }
}

export async function loadFaculties() {
  const res = await fetch("/emc-system/api/getFaculties.php");

  const faculties = await res.json();
  console.log(faculties);
  const faculty = document.getElementById("faculty");

  faculties.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;

    faculty.append(option);
  });
}
export async function loadDepartments() {
  const faculty = document.getElementById("faculty");
  const department = document.getElementById("department");

  faculty.addEventListener("change", async () => {
    department.innerHTML = `
      <option value='' disabled selected>Select Department</option>
    `;
    department.disabled = true;

    if (!faculty.value) {
      return;
    }
    console.log(faculty.value);

    const res = await fetch(
      `/emc-system/api/getDepartments.php?faculty_id=${faculty.value}`,
    );
    const departments = await res.json();
    console.log(departments);

    departments.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;

      department.append(option);
    });
    department.disabled = false;
  });
}

export async function loadCourses() {
  const department = document.getElementById("department");
  const course = document.getElementById("course");

  department.addEventListener("change", async () => {
    course.innerHTML = `
      <option value='' disabled selected>Select Course</option>
    `;

    course.disabled = true;

    if (!department.value) {
      return;
    }

    const res = await fetch(
      `/emc-system/api/getcourses.php?department_id=${department.value}`,
    );
    const courses = await res.json();

    courses.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;

      course.append(option);
    });
    course.disabled = false;
  });
}

function viewDetail(param) {
  const role = document.body.dataset.role;
  const {
    case_id,
    student_id,
    faculty_id,
    department_id,
    course_id,
    exam_date,
    exam_time,
    venue,
    misconduct_type,
    description,
    reported_by,
    assigned_officer,
    created_at,
    updated_at,
    status,
    priority,
  } = param;

  const pointer = role === "officer" ? reported_by : assigned_officer;
  const action = role === "officer" ? "Reported By" : "Assigned By";

  return `
    <div class='group'>
      <div>Case: ${case_id}</div>
    </div>
    <span class='cancil'>X</span>
    <hr>
    <div class='group'>
      <div>Student: ${student_id}</div>
      <div>Matrix: null</div>
      <div>Faculty: ${faculty_id}</div>
      <div>Department: ${department_id}</div>
      <div>Course: ${course_id}</div>
    </div>
    <div class='group'>
      <div>Exam Date: ${exam_date}</div>
      <div>Exam Time: ${exam_time}</div>
      <div>Venue: ${venue}</div>
    </div>
    <div class='group'>
      <div>Misconduct: ${misconduct_type}</div>
      <div>Description: ${description}</div>
      <div>${action}: ${pointer}</div>
    </div>
    <div class='group'>
      <div>Status: ${status}</div>
      <div>Created_at: ${created_at}</div>
      <div>Updated_at: ${updated_at}</div>
      <div>Priority: ${priority}</div>
    </div>
    <hr>
    <button id='takeCase'>Take Case</button>
  `;
}

function viewSchedule(param) {
  const {
    case_id,
    student_id,
    faculty_id,
    department_id,
    course_id,
    misconduct_type,
    description,
    status,
  } = param;

  return `
    <div class='group'>
      <div>Case: ${case_id}</div>
    </div>
    <span class='cancil'>X</span>

    <hr>

    <div class='group'>
      <div>Student: ${student_id}</div>
      <div>Faculty: ${faculty_id}</div>
      <div>Department: ${department_id}</div>
      <div>Course: ${course_id}</div>
      <div>Misconduct: ${misconduct_type}</div>
      <div>Description: ${description}</div>
    </div>
    <div>Status: ${status}</div>
    <button id='goto'>schedule</button>
  `;
}

function showForm() {
  return `
    <div class='group'>
      <header>Schedule The Meeting</header>
    </div>
    <span class='cancil'>X</span>
    <hr>

    <div class='group'>
      <form id='schedule'>
        <label>Meeting Date</label>
        <input type='date' id='date'>

        <label>Meeting Time</label>
        <input type='time' id='time'>

        <label>Venue</label>
        <select id='venue' required>
          <option selected disabled>Select Venue</option>
          <option value='EMC Committee Room'>EMC Committee Room</option>
          <option value='Staff Secteriate'>Staff Secteriate</option>
          <option value='Security Room'>Security Room</option>
        </select>

        <button type='submit'>Schedule Meeting</button>
      </form>
    </div>
  `;
}
