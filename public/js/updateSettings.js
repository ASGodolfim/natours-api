import axios from "axios";
import { showAlert } from "./alarm";

export const updateUser = async (data, type) => {
    try{
        const url = type === 'password'
            ? '/api/v1/users/updateMyPassword' 
            : '/api/v1/users/updateMe';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        
        if(res.data.status === 'success'){
            showAlert('success', 'Account updated sucessfuly')
        };

    }catch (err) {
        showAlert('error', err.response.data.message);

    }
}