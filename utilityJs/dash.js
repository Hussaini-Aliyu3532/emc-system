import { logOut, redirectByRole, requiredRole, savedUser } from "./auth.js";
import { getCases, getUsers } from "./servces.js";
import { toggle, renderProfile, renderAdminDash, renderOfficer, renderInvigilator, loadFaculties } from "./ui.js";

document.querySelector(".menu").addEventListener("click", toggle);
document.getElementById("logout").addEventListener("click", logOut);

async function initDash() {
  const currentUser = await savedUser();
  
  const currentPage = document.body.dataset.page;
  const userRole = document.body.dataset.role;

  const allowed = requiredRole(userRole, currentUser);

  if (!allowed) return;

  const users = await getUsers();
  const cases = await getCases();

  renderProfile(currentUser);
  switch (userRole) {
    case "admin":
      renderAdminDash(users);
      break;
    case "officer":
      renderOfficer(cases, currentPage, currentUser);
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
