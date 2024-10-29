import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateUser } from './updateSettings';

console.log('test from index');

const updatePasswordForm = document.querySelector('.form-user-settings');
const updateForm = document.querySelector('.form-user-data');
const logOutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.form--login');
const mapBox = document.getElementById('map');

if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
};
if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}
if (logOutBtn) logOutBtn.addEventListener('click', logout);

if(updateForm){
    updateForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateUser({name, email}, 'data');
    });
}
if(updatePasswordForm){
    updatePasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        updateUser({passwordCurrent, password, passwordConfirm}, 'password')
    });
}