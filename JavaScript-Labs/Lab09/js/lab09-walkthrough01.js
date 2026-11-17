// Chạy đến bước nào (2..14). Mặc định chạy hết; dùng ?step=N để chụp ảnh từng bước.
var LAST_STEP = Number(new URLSearchParams(window.location.search).get("step")) || 14;

var msg = document.getElementById("msgArea");
var elem, counts, ps, i;

// Bước 2: chọn textarea và gán value
if (LAST_STEP >= 2) { msg.value = "here is some text"; }

// Bước 3-4: đổi tiêu đề (bước 4 viết gọn, không dùng biến tạm)
if (LAST_STEP >= 3) {
    var title = document.getElementById("pageTitle");
    title.innerHTML = "New Title";
}
if (LAST_STEP >= 4) { document.getElementById("pageTitle").innerHTML = "Even newer title"; }

// Bước 5-6: innerHTML và innerText
if (LAST_STEP >= 5) { msg.value = document.getElementById("first").innerHTML; }
if (LAST_STEP >= 6) { msg.value = document.getElementById("first").innerText; }

// Bước 7: getAttribute
if (LAST_STEP >= 7) { msg.value = "My class is " + msg.getAttribute("class"); }

// Bước 8: getElementsByTagName
if (LAST_STEP >= 8) {
    elem = document.getElementsByTagName("textarea");
    elem[0].value = "selected by tag name";
}

// Bước 9: tất cả thẻ <span>
if (LAST_STEP >= 9) {
    elem = document.getElementsByTagName("span");
    for (i = 0; i < elem.length; i++) {
        document.getElementById("msgArea").value += "\n" + elem[i].innerText;
    }
}

// Bước 10: getElementsByClassName
if (LAST_STEP >= 10) {
    document.getElementById("msgArea").value = "";
    counts = document.getElementsByClassName("count-number");
    for (i = 0; i < counts.length; i++) {
        document.getElementById("msgArea").value += "\n" + counts[i].innerText;
    }
}

// Bước 11: querySelector (phần tử đầu tiên khớp)
if (LAST_STEP >= 11) {
    ps = document.querySelector("#first p");
    document.getElementById("msgArea").value = ps.innerHTML;
}

// Bước 12: querySelectorAll (tất cả phần tử khớp)
if (LAST_STEP >= 12) {
    ps = document.querySelectorAll("#first p");
    for (i = 0; i < ps.length; i++) {
        document.getElementById("msgArea").value += ps[i].innerHTML + "\n";
    }
}

// Bước 13: ẩn textarea bằng class "hidden"
if (LAST_STEP >= 13) { document.getElementById("msgArea").setAttribute("class", "hidden"); }

// Bước 14: đổi màu nền
if (LAST_STEP >= 14) { document.getElementById("features").style.backgroundColor = "green"; }
