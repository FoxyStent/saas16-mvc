const logout = () => {
    const req = new XMLHttpRequest();
    const url = "http://localhost:3000/user/logout"
    const data = {
        'refresh_token': localStorage.getItem('refresh_token'),
    };

    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
            window.location = "/";
        }

    }
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));
}

const handleChange = (e) => {
    if (e.length > 2){
        const req = new XMLHttpRequest();
        const url = "http://localhost:3000/question/title/"+e;

        req.onreadystatechange = function () {
            if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
                console.log(req.response);
            }

        }
        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
    }
}