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
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        };

        console.log(res)

    }catch (err) {
        alert(err.response.data.message)
    }
}


