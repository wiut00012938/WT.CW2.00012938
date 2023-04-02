const canvasElement = document.getElementById("cookieChart")
const rowlast7Days = document.getElementById("days").value
const last7Days = rowlast7Days.split(',').map(dateString => new Date(dateString).toLocaleDateString());
const rowtotalAmounts = document.getElementById("amount").value
const totalAmounts = rowtotalAmounts.split(',').map(parseFloat);
var config = {
    type: "bar",
    data : {
    labels: last7Days,
    datasets: [{label: "Amount of spending for specific day",data: totalAmounts,
    backgroundColor:[
        "rgba(255,159,64,0.4)",
        "rgba(255,99,132,0.4)",
        "rgba(54,162,235,0.4)",
        "rgba(75,192,192,0.4)",
        "rgba(153,102,255,0.4)"
    ],
    borderColor:[
        "rgba(255,159,64,0.4)",
        "rgba(255,99,132,0.4)",
        "rgba(54,162,235,0.4)",
        "rgba(75,192,192,0.4)",
        "rgba(153,102,255,0.4)"
    ],
    borderWidth: 1
}],
},
};

var cookieChart = new Chart(canvasElement,config)