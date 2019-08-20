d3.csv("data/budget_gross.csv", function(myData) {
    // console.log(myData)

    function thousands_separators(num) {
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    }

    grossBackgroundColor = []

    titles = []
    budget = []
    gross = []
    percentage = []


    myData.forEach(function(d) {

        d.Budget = +d.Budget
        d.Gross = +d.Gross

        titles.push(d.Title)
        budget.push(d.Budget)
        gross.push(d.Gross)
        percentage.push(Math.round((d.Gross-d.Budget)*100/d.Budget))

    })

    $.each(gross, function( index,value ) {
        if(value>=1000000000){
            grossBackgroundColor[index]="yellow";
        }else{
            grossBackgroundColor[index]="green";
        }
    });

    // console.log(titles)
    // console.log(budget)
    // console.log(gross)
    // console.log(percentage)
    // console.log(grossBackgroundColor)

    const myChart = document.getElementById("barChart").getContext("2d");

        Chart.defaults.global.defaultFontFamily = "Helvetica";
        Chart.defaults.global.defaultFontSize = 11;
        Chart.defaults.global.defaultFontColor = "black";
        Chart.defaults.global.animation.duration = 3750
        Chart.defaults.global.legend.position = "top"
        Chart.defaults.global.tooltips.mode = "index"
        

    var barChart = new Chart(myChart, {
        type: "bar",
        data: {
            labels: titles,//.slice(0, n),
            datasets: [{
                label: "Budget",
                data: budget,//.slice(0, n),
                backgroundColor: "red",
                borderWidgth: 1,
                borderColor: "grey",
                hoverBorderWidth: 1,
                hoverBorderColor: "black"
            },
            {
                label: "Gross",
                data: gross,//.slice(0, n),
                backgroundColor: grossBackgroundColor,
                borderWidgth: 1,
                borderColor: "grey",
                hoverBorderWidth: 1,
                hoverBorderColor: "black"
            }
        ],
            
        },
        options: {

            title: {
                display: true,
                text: "Budget/Gross/Profit of Top Rated Movies IMDb",
                fontSize: 30
            },
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: false }]
            },
            tooltips: {
                titleFontSize: 30,
                titleMarginBottom: 20,
                titleFontFamily: "Arial",
                bodyFontSize: 25,
                bodyFontStyle: "bold",
                bodyFontColor: ["red", grossBackgroundColor],
                bodyFontFamily: "Arial",
                footerFontStyle: "bold",
                footerFontSize: 25,
                footerFontColor: "lightgreen",
                footerFontFamily: "Arial",
                xPadding: 20,
                yPadding: 20,
                cornerRadius: 15, 
                callbacks: {

                    title: (item, data) => data.labels[item[0].index],
                    label: (item, data) => data.datasets[item.datasetIndex].label + ": $" + thousands_separators(data.datasets[item.datasetIndex].data[item.index]),
                    footer: (item, data) => "Profit: $" + thousands_separators(data.datasets[1].data[item[0].index] - data.datasets[0].data[item[0].index]) + " (" + Math.round((data.datasets[1].data[item[0].index] - data.datasets[0].data[item[0].index]) *100 / data.datasets[0].data[item[0].index]) + " %)",
                    
                }
                
            },
            // events: ["click"]
            
        }

    })

    const myChart1 = document.getElementById("barChart1").getContext("2d");

        Chart.defaults.global.defaultFontFamily = "Helvetica";
        Chart.defaults.global.defaultFontSize = 11;
        Chart.defaults.global.defaultFontColor = "black";
        Chart.defaults.global.animation.duration = 3750
        Chart.defaults.global.legend.position = "top"
        Chart.defaults.global.tooltips.mode = "index"
        

    var barChart1 = new Chart(myChart1, {
        type: "bar",
        data: {
            labels: titles,//.slice(0, n),
            datasets: [
            {
                label: "Percentage",
                data: percentage,
                backgroundColor: "brown",
                borderWidgth: 1,
                borderColor: "grey",
                hoverBorderWidth: 1,
                hoverBorderColor: "black"
            }
        ],
            
        },
        options: {

            title: {
                display: true,
                text: "Percentage Earned",
                fontSize: 30
            },
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: false }]
            },
            tooltips: {
                titleFontSize: 30,
                titleMarginBottom: 20,
                titleFontFamily: "Arial",
                bodyFontSize: 25,
                bodyFontStyle: "bold",
                bodyFontColor: "orange",
                bodyFontFamily: "Arial",
                footerFontStyle: "bold",
                footerFontSize: 25,
                footerFontColor: "lightgreen",
                footerFontFamily: "Arial",
                xPadding: 20,
                yPadding: 20,
                cornerRadius: 15, 
                callbacks: {

                    title: (item, data) => data.labels[item[0].index],
                    label: (item, data) => data.datasets[item.datasetIndex].label + " earned : " + data.datasets[item.datasetIndex].data[item.index] + " %",
                    
                }
                
            },
            
        }

    })


})

