var daysOfWeek = new Array("Mon", "Tues", "Wed", "Thur", "Fri");
daysOfWeek.push("Sat");  
daysOfWeek.unshift("Sun");
//document.write(daysOfWeek + "<br/>");

document.write("<table border=1>");
document.write("<tr>");
for (var i = 0; i < daysOfWeek.length; i++) {
    var day;
    if (daysOfWeek[i].length < 4)
        day = daysOfWeek[i];
    else
        day = "<em>" + daysOfWeek[i] + "</em>";   // Tues, Thur in nghiêng đỏ
    document.write("<th>" + day + "</th>");
}
document.write("</tr>");

// Các ngày 1..30, tháng bắt đầu vào Chủ nhật
var totalDays = 30;
document.write("<tr>");
for (var d = 1; d <= totalDays; d++) {
    document.write("<td>" + d + "</td>");
    if (d % 7 === 0 && d < totalDays) {
        document.write("</tr><tr>");
    }
}
document.write("</tr>");
document.write("</table>");
