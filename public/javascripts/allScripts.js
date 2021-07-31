const showMoreQuestions = () => {
    const req = new XMLHttpRequest();
    const offset = parseInt(localStorage.getItem("items")) || 0;
    const url = "http://localhost:3000/question/all/" + offset;
    localStorage.setItem("items", offset+offset);
    console.log(offset);
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
            if (req.response === "[]") {
                alert("No more Questions to show");
            }

            else {
                const items = JSON.parse(req.response);
                localStorage.setItem("items", offset+offset);
                for (var item of items) {
                    document.getElementById("more").innerHTML +=
                        "<div class='row border justify-content-start'>" +
                        "<a class='fs-2' href='/question/'" + item['qId'] + "'>" + item['title'] + "</a>" +
                        "<text>" + item['text'] + "</text>" +
                        "<text>" + item['keywords'] + "</text>" +
                        "</div>"
                }
            }
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

const showMoreUsersAnswers = () => {
    const req = new XMLHttpRequest();
    const offset = parseInt(localStorage.getItem("items")) || 0;
    const user = localStorage.getItem('user_logged');
    const url = "http://localhost:3000/user/"+user+"/answers/" + offset;
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
            if (req.response === "[]") {
                alert("No more Answers to show");

            }
            else {
                const items = JSON.parse(req.response);
                localStorage.setItem("items", offset+offset);
                for (var item of items) {
                    document.getElementById("more").innerHTML +=
                        "<div class='row border justify-content-start'>" +
                        "<a class='fs-2' href='/question/'" + item['qId'] + "'>" + item['title'] + "</a>" +
                        "<text>" + item['text'] + "</text>" +
                        "<text>" + item['keywords'] + "</text>" +
                        "</div>"
                }
            }
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

const showMoreUsersQuestions = () => {
    const req = new XMLHttpRequest();
    const offset = parseInt(localStorage.getItem("items")) || 0;
    const user = localStorage.getItem('user_logged');
    const url = "http://localhost:3000/user/"+user+"/questions/" + offset;
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
            if (req.response === "[]") {
                alert("No more Questions to show");
            }

            else {
                const items = JSON.parse(req.response);
                localStorage.setItem("items", offset+offset);
                for (var item of items) {
                    document.getElementById("more").innerHTML +=
                        "<div class='row border justify-content-start'>" +
                        "<a class='fs-2' href='/question/'" + item['qId'] + "'>" + item['title'] + "</a>" +
                        "<text>" + item['text'] + "</text>" +
                        "<text>" + item['keywords'] + "</text>" +
                        "</div>"
                }
            }
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