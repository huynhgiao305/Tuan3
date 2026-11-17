var countries = [
    { name: "Bahamas", iso: "BS", capital: "Nassau", population: 301790 },
    { name: "Canada", iso: "CA", capital: "Ottawa", population: 33679000 },
    { name: "Germany", iso: "DE", capital: "Berlin", population: 81802257 },
    { name: "Spain", iso: "ES", capital: "Madrid", population: 46505963 },
    { name: "United Kingdom", iso: "GB", capital: "London", population: 62348447 }
];

for (var i = 0; i < countries.length; i++) {
    var c = countries[i];
    document.write("<div class='box'>");
    // Cờ lấy từ flagcdn.com (thay cho thư mục flags/ của giáo trình)
    document.write("<img src='https://flagcdn.com/w40/" + c.iso.toLowerCase() + ".png' class='boxImg' alt='" + c.name + "'>");
    document.write("<div>");
    for (var propertyName in c) {
        document.write("<strong>");
        document.write(propertyName + ": ");
        document.write("</strong>");
        document.write(c[propertyName]);
        document.write("<br>");
    }
    document.write("</div>");
    document.write("</div>");
}
