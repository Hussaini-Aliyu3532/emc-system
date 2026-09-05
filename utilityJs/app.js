import { openModel, closeModel, renderUser, clearTable, toggle } from "./ui.js";
import {
  getUsers,
  isDuplicateUser,
  updateStatus,
  updateUser,
  deleteUser,
} from "./servces.js";
import { logOut } from "./auth.js";


document.querySelector(".addBtn").addEventListener("click", openModel);
document.getElementById("x").addEventListener("click", closeModel);
document.getElementById('logout').addEventListener('click', logOut);
document.querySelector(".menu").addEventListener("click", toggle);

const fullName = document.getElementById("name");
const dataRole = document.body.dataset.role;
const identifier = dataRole === 'student' ?
      document.getElementById('matrix') :
      document.getElementById('email');
const password = document.getElementById("password");
const form = document.querySelector(".popForm");
let editId = null;
let users = [];

const field = dataRole === "student" ? "matrix" : "email";

fullName.focus();
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    fullName: fullName.value,
    email: null,
    matrix: null,
    password: password.value,
    status: "active",
    role: dataRole,
  };

  userData[field] = identifier.value;

  try {
    await isDuplicateUser(users, field, identifier.value, dataRole, editId);

    if (editId) {
      await updateUser(editId, userData);
    } else {
      const res = await fetch("/emc-system/api/addUser.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      console.log(data);
    }
    editId = null;
    form.reset();
    password.required = true;
    password.placeholder = "";
    closeModel();
    await reloadTable();
  } catch (err) {
    console.log(err.message);
    alert(err.message);
  }
});

document.querySelector("tbody").addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  const id = Number(tr.dataset.id);

  if (e.target.classList.contains("delete")) {
    const confirmDelete = confirm("Are you sure want to delete that user?");

    if (confirmDelete) {
      await deleteUser(id);
      tr.remove();
      await reloadTable();
    }
  }

  if (e.target.classList.contains("edit")) {
    editId = id;

    const user = users.find((u) => u.id === editId);

    fullName.value = user.fullName;
    if(user.email){
      email.value = user.email;
    }
    else if(user.matrix){
      matrix.value = user.matrix;
    }

    password.required = false;
    password.value = "";
    password.placeholder = "Leave blank to keep corrent password";

    openModel();
  }

  if (e.target.classList.contains("toggle")) {
    const user = users.find((u) => u.id === id);
    const status = user.status === "active" ? "inactive" : "active";

    if (user.status === "active") {
      const confirmToggle = confirm(
        "Are you sure want to deactivate this user?",
      );
      if (confirmToggle) {
        await updateStatus(id, status);
      }
    } else {
      await updateStatus(id, status);
    }
    await reloadTable();
  }
});

async function reloadTable() {
  clearTable();

  const rowUsers = await getUsers();
  users = rowUsers.map((user) => ({
    ...user,
    id: Number(user.id),
  }));

  const filteredRole = users.filter((user) => user.role === dataRole);
  filteredRole.forEach(renderUser);
}
await reloadTable();
