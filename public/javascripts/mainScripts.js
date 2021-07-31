const profile = () => {
    window.location = "/user/"+localStorage.getItem("user_logged") + "/profile";
}

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
                const data = JSON.parse(req.response);
                console.log(data);
                document.getElementById('search').innerHTML = data.map( q => {
                    return "<div class='row border justify-content-start'> \
                        <a class='fs-2' href='/question/"+q['qId'] + "'>"+ q['title']+"</a> \
                        <text>" + q['text'] + "</text> \
                    </div> \
                    "
                }).join('');
            } else if (req.readyState === XMLHttpRequest.DONE && req.status === 401){
                const ans = confirm("Your sessions has ended. Please Log In again");
                if (ans)
                    window.location("/login");
                else
                    window.location("/");
            }

        }
        req.open('GET', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
    }
    else {
        document.getElementById('search').innerHTML = "";
    }
}