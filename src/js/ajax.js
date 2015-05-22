var xmlhttp;

if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
        if(xmlhttp.status == 200){
            var r = processMenu(JSON.parse(xmlhttp.responseText).menu);
            document.body.appendChild(r);
        } else if (xmlhttp.status == 400) {
            alert('There was an error 400');
        } else {
            alert('something else other than 200 was returned');
        }
    }
};

xmlhttp.open("GET", "./menu.json", true);
xmlhttp.send();

var contentList = [];
var processMenu = function (menu, parent) {
    var ul = document.createElement('ul');

    for (var i = 0; i < menu.length; i++) {
        var li = document.createElement('li'),
            anchor = document.createElement('a');

        anchor.setAttribute('id', menu[i].id);
        anchor.setAttribute('class', menu[i].cssClass);
        anchor.innerText = menu[i].description;

        contentList[menu[i].id] = menu[i].content;

        li.appendChild(anchor);
        ul.appendChild(li);

        if (!menu[i].leaf) {
            processMenu(menu[i].menu, ul);
        }
    }

    if (parent !== undefined) {
        var parentLi = document.createElement('li');
        parentLi.appendChild(ul);
        parent.appendChild(parentLi);
        return parent;
    } else {
        return ul;
    }
};

document.getElementsByTagName('a')[0].addEventListener('click', function () {
    console.log(this);
});