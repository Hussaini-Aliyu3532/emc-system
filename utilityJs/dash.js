import { logOut, redirectByRole, requiredRole, savedUser } from "./auth.js";
import { getCases, getUsers } from "./servces.js";
import { toggle, renderProfile, renderAdminDash, renderOfficer, renderInvigilator, loadFaculties } from "./ui.js";

document.querySelector(".menu").addEventListener("click", toggle);
document.getElementById("logout").addEventListener("click", logOut);

async function initDash() {
  const users = await getUsers();
  const currentUser = await savedUser();
  const currentPage = document.body.dataset.page;
  const userRole = document.body.dataset.role;
  const cases = await getCases();

  const allowed = requiredRole(userRole, currentUser);

  if (!allowed) return;

  renderProfile(currentUser);
  switch (userRole) {
    case "admin":
      renderAdminDash(users);
      break;
    case "officer":
      renderOfficer(cases, currentPage);
      break;
    case "invigilator":
      renderInvigilator(cases, currentPage);
      break;
    default:
      console.error("invalid role: ", userRole);
      redirectByRole(userRole);
  }
}
initDash();
