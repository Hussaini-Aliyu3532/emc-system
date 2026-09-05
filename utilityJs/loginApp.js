import { login, logOut, redirectByRole, savedUser } from "./auth.js";

const form = document.querySelector('.login-form');
document.getElementById('email').focus();

form.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    try{
        const user = await login(email.value, password.value);
        console.log(user);
        savedUser(user);
        redirectByRole(user.role);
    }
    catch(err){
        alert(err.message);
    }
    form.reset();
    setTimeout(()=> email.focus(), 100);
});