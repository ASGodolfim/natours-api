import axios from "axios";
import { showAlert } from "./alarm";

export const updateUser = async (name, email) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Account updated sucessfuly')
        };
        console.log(res.data);

    }catch (err) {
        showAlert('error', 'invalid name or email');
        console.debug(res.data);
    }
}