const showMore = () => {
    const req = new XMLHttpRequest();
    const offset = parseInt(localStorage.getItem("items")) || 0;
    const url = "http://localhost:3000/question/all/" + offset;
    localStorage.setItem("items", offset+offset);
    console.log(offset);
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200){
            const items = JSON.parse(req.response);
            if (items === [])
                console.log(req.response)
            for (var item of items) {
                document.getElementById("more").innerHTML +=
                    "<div class='row border justify-content-start'>" +
                    "<a class='fs-2' href='/question/'"+item['qId']+"'>" + item['title'] + "</a>" +
                    "<text>"+item['text']+"</text>" +
                    "<text>"+item['keywords']+"</text>" +
                    "</div>"
            }
        }
    }

    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send();
}