export async function login(identifier, password){
    const res = await fetch('/emc-system/api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            identifier,
            password
        })
    });

    const data = await res.json();
    if(!data.success || data.user.status !== 'active'){
        throw new Error('invalid credencial or inactive user');
    }

    return data.user;
}

export async function savedUser(user) {
    const res = await fetch('/emc-system/api/session.php');
    const data = await res.json();
    const currentUser = data.user;

    return currentUser;
}


export async function logOut(){
    await fetch('/emc-system/api/logout.php');
    location.href = '/emc-system/index.html';
}

export function requiredRole(role, currentUser){
    if(!currentUser){
        location.href = '/emc-system/index.html';
        return false;
    }

    if(currentUser.role !== role ){
        redirectByRole(currentUser.role);
        return false;
    }
    return true;
}

export function redirectByRole(role){
    switch(role){
        case 'admin':
            location.href = '/emc-system/adminDashboard.html';
            break;
        case 'officer': 
            location.href = '/emc-system/dashboards/officerDash.html';
            break;
        case 'invigilator': 
            location.href = '/emc-system/dashboards/invigilatorDash.html';
            break;
        default:
            location.href = '/emc-system/index.html';
    }
}