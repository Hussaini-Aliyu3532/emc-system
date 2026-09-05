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