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
        }
    }

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));
}

$(document).onload = () => {
    console.log('loaded');
    if (localStorage.getItem('userLogged') !== ""){
        console.log('logged')
        $('#myProfile').hidden = false;
        $('#loginref').hidden = true;
    }
    else {
        console.log('not logged')
        $('#myProfile').hidden = true;
        $('#loginref').hidden = false;
    }
}