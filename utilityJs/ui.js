import { getCases } from "./servces.js";

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

export async function reloadOffDashTable(caseItem) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td>${caseItem.case_id}</td>
      <td>${caseItem.student_id}</td>
      <td>${caseItem.status}</td>
      <td class='action'><button class='view'>view</button></td>
    `;
    document.querySelector('tbody').append(tr);
}

export async function reloadViewCaseTable(caseItem) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td>${caseItem.case_id}</td>
      <td>${caseItem.student_id}</td>
      <td>${caseItem.reported_by}</td>
      <td>${caseItem.exam_date}</td>
      <td>${caseItem.status}</td>
      <td class='action'><button class='view'>view</button></td>
    `;
    document.querySelector('tbody').append(tr);
}

export async function reloadScheduleMeetingTable(caseItem) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td>${caseItem.case_id}</td>
      <td>${caseItem.student_id}</td>
      <td>${caseItem.exam_date}</td>
      <td>${caseItem.exam_time}</td>
      <td>${caseItem.venue}</td>
      <td class='action'><button class='view'>view</button></td>
    `;
    document.querySelector('tbody').append(tr);
}

export async function renderOfficer(cases, currentPage) {
  switch (currentPage) {
    case "offDash":
      cases.forEach(reloadOffDashTable);
      break;
    case "viewCases":
      cases.forEach(reloadViewCaseTable);
      break;
    case "scheduleMeeting":
      cases.forEach(reloadScheduleMeetingTable);
      break;
  }
}

export function renderInvigilator(user) {
  loadFaculties();
  loadDepartments();
  loadCourses();
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
