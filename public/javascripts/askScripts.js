const submitQuestion = () => {
    const req = new XMLHttpRequest();
    const url = "/question"
    const data = {
        'title': document.getElementById('title').value,
        'userUsername': localStorage.getItem('user_logged'),
        'text': document.getElementById('text').value,
        'keywords': document.getElementById('keywords').value,
    };

    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            let res = JSON.parse(req.response);
            window.location = "/question/" + res["qId"];
        } else if (req.readyState === XMLHttpRequest.DONE && req.status === 401) {
            const ans = confirm("Your sessions has ended. Please Log In again");
            if (ans){
                window.location("/login");
                console.log('yes');
            }
            else {
                window.location("/");
                console.log('no');
            }
        }
    }
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));
}