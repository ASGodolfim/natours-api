import axios from 'axios';
import { showAlert } from './alarm';

console.log('test from login');

export const login = async (email, password) => {
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        console.log(res.data);
        if(res.data.status === 'success'){
            showAlert('success', 'Logged in successfuly')
            console.log(showAlert)
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        };
        console.log(res)

    }catch (err) {
        showAlert('error', 'incorrect email/password');
        console.log(showAlert)
    }
}
