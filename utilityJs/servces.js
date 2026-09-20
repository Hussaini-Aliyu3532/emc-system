export async function getUsers(){
    const res = await fetch('/emc-system/api/getUsers.php');
    const users = await res.json();
    return users;
}

export async function isDuplicateUser(users, field, identifier, role, editId = null){
    const duplicate = users.find(u => 
        u[field] === identifier &&
        u.role === role && 
        u.id !== editId
    );

    if (duplicate) {
        throw new Error(`${field} already exist`);
    }
}

export async function deleteUser(id){
    const res = await fetch(`/emc-system/api/deleteUser.php?id=${id}`);
    const data = await res.json();
    console.log(data.success);
}

export async function updateUser(editId, data){
    const res = await fetch('/emc-system/api/updateUser.php',{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: editId,
            ...data
        })
    });

    const modiData = await res.json();
    console.log(modiData);
}

export async function updateStatus(id, status){
    const res = await fetch('/emc-system/api/updateUser.php', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, status})
    });
    const data = await res.json();
    console.log(data.success);
}

export async function getCases() {
    const res = await fetch('/emc-system/api/getCases.php');
    const cases = await res.json();
    
    return cases;
}
export async function takeCase(case_id) {
  const res = await fetch("/emc-system/api/session.php");
  const data = await res.json();

  const caseData = await fetch("/emc-system/api/reportCase.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assigned: data.user.id, case_id: case_id }),
  });

  const result = await caseData;
  close();
}

export function close() {
  document.querySelector(".overlay").classList.remove("enable");
}

export async function postMeeting(caseID) {
    const meeting_date = document.getElementById("date");
    const meeting_time = document.getElementById("time");
    const venue = document.getElementById("venue");
    
    const form = document.getElementById('schedule');
    form.addEventListener('submit', async(e)=>{
        e.preventDefault();

        const meetingInfo = {
        meeting_date: meeting_date.value,
        meeting_time: meeting_time.value,
        venue: venue.value,
        case_id: caseID
        };

        const res = await fetch('/emc-system/api/reportCase.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meetingInfo)
        });

        const data = await res.text();
        console.log('ROW DATA: ',meetingInfo);
        console.log('SERVER RESPONSE: ',data);
    });
}