// Bước 6: duyệt các node con của #stories
var stories = document.getElementById("stories");
for (var i = 0; i < stories.childNodes.length; i++) {
    console.log("child " + i + " =" + stories.childNodes[i] +
                " nodeType=" + stories.childNodes[i].nodeType);
}

// Bước 7: đổi màu nền các node không phải text (nodeType 1 = element)
for (var j = 0; j < stories.childNodes.length; j++) {
    if (stories.childNodes[j].nodeType === 1) {
        stories.childNodes[j].style.backgroundColor = "green";
    }
}
