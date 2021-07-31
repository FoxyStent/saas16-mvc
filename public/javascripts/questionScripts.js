const submitAnswer = () => {
    const req = new XMLHttpRequest();
    const url = "http://localhost:3000/answer"
    const qid = window.location.pathname.split('/')[2]
    const data = {
        'qid' : qid,
        'text': document.getElementById('text').value,
        'userUsername': localStorage.getItem('user_logged'),
    };
    console.log(data);

    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
            location.reload();
        } else if (req.readyState === XMLHttpRequest.DONE && req.status === 401){
            const ans = confirm("Your sessions has ended. Please Log In again");
            if (ans)
                window.location("/login");
            else
                window.location("/");
        }
    }

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));
}