const signup = function () {
    console.log('signup');
}

const login = function () {
    const req = new XMLHttpRequest();
    const url = "http://localhost:3000/user/login"
    const data = {
        'username': document.getElementById('username').value,
        'password': document.getElementById('password').value
    };

    req.onreadystatechange = function () {
        console.log(req);
        if (req.readyState === XMLHttpRequest.DONE && req.status === 404 && req.response === 'UserNotFound'){
            document.getElementById('error').innerHTML =
                "<p class=\"mt-2 alert alert-danger text-center\">This user doesn't exists.</p>"
        }
        else if (req.readyState === XMLHttpRequest.DONE && req.status === 401 && req.response === 'WrongPass'){
            document.getElementById('error').innerHTML =
                "<p class=\"mt-2 alert alert-danger text-center\">Passwords don't match.</p>"
        }
        else if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
            const tokens = JSON.parse(req.response);
            console.log(tokens);
            console.log(document.cookie);
            localStorage.setItem('refresh_token', tokens.refresh_token);
            window.location = "/";
        }

    }
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));
}
