import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateUser } from './updateSettings';
import { bookTour } from './stripe';

const updatePasswordForm = document.querySelector('.form-user-settings');
const updateForm = document.querySelector('.form-user-data');
const logOutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.form--login');

const mapBox = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');

if(bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}

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
        const form = new FormData();
        form.append('name',  document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])
        updateUser(form, 'data');
    });
}
if(updatePasswordForm){
    updatePasswordForm.addEventListener('submit',async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...'

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateUser({passwordCurrent, password, passwordConfirm}, 'password');

        document.querySelector('.btn--save-password').value = 'Save Password'
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}