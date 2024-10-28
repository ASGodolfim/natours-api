import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

const loginForm = document.querySelector('.form')
const mapBox = document.getElementById('map')

if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
};
if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        login(email, password);
    });
}