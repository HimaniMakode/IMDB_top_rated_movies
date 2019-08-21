// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // Define SVG area dimensions
    var svgWidth = 960;
    var svgHeight = 500;

    // Define the chart's margins as an object
    var margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
    };

    var width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Define dimensions of the chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set its dimensions
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append a group area, then set its margins
    var chartGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // Configure a parseTime function which will return a new Date object from a string

    var parseTime = d3.timeParse("%Y");
    // Load data from top_movies_updated.json

    d3.json("top_movies_updated.json", function (error, MoviesData) {
        // Throw an error if one occurs
        if (error) throw error;
        // Print the MoviesData
        console.log(MoviesData);
        //append years in years list
        var years = [];
        MoviesData.forEach(function (d) {
            years.push(d.Year);
        });
        console.log(years);

        //dictionary containing count of no. of top rated movies in particular year
        var AllYears = new Object();
        var allYear = [];
        var Yearcount = 0;
        for (var j = 0; j < years.length; j++) {
            if (allYear.indexOf(years[j]) == -1) {
                AllYears[years[j]] = 1;
                allYear.push(years[j]);
            } else {
                AllYears[years[j]] += 1;
            }
        }
        //console.log(AllYears);
        //List of years
        var YearKey = Object.keys(AllYears);
        var AllYearKey = YearKey.map(Number);
        //List of number of top movies per year
        var YearValue = Object.values(AllYears);
        console.log(AllYearKey);
        console.log(YearValue);

        yearsMovNum = []

        for (var j = 0; j < AllYearKey.length; j++) {
            a = new Object()
            a.year = AllYearKey[j]
            a.num = YearValue[j]
            yearsMovNum.push(a)
        }

        // Create a scale for your independent (x) coordinates
        var xScale = d3
            .scaleLinear()
            .domain(d3.extent(yearsMovNum, data => data.year))
            .range([0, chartWidth]);

        // Create a scale for your dependent (y) coordinates
        var yScale = d3
            .scaleLinear()
            .domain([0, d3.max(yearsMovNum, data => data.num)])
            .range([chartHeight, 0]);

        //var bottomAxis = d3.axisBottom(xScale);
        var bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

        var leftAxis = d3.axisLeft(yScale);
        // Configure a drawLine function which will use our scales to plot the line's points
        var drawLine = d3
            .line()
            .x(data => xScale(data.year))
            .y(data => yScale(data.num));

        // Append an SVG path and plot its points using the line function
        chartGroup
            .append("path")
            // The drawLine function returns the instructions for creating the line for MoviesData
            .attr("d", drawLine(yearsMovNum))
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 2.5)
            .classed("line", true);

        // append circles to data points
        var circlesGroup = chartGroup.selectAll("circle")
            .data(yearsMovNum)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => xScale(d.year))
            .attr("cy", d => yScale(d.num))
            .attr("r", "5")
            .attr("fill", "red");

        // Append an SVG group element to the SVG area, create the left axis inside of it

        chartGroup
            .append("g")
            .classed("axis", true)
            .call(leftAxis);

        // Append an SVG group element to the SVG area, create the bottom axis inside of it
        // Translate the bottom axis to the bottom of the page
        chartGroup
            .append("g")
            .classed("axis", true)
            .attr("transform", "translate(0, " + chartHeight + ")")
            .call(bottomAxis);

        //label for x axis
        // Create group for x- axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width + 50}, ${height + 130})`);

        var hairLengthLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("stroke", "orange")
            /*.attr("value", "hair_length")*/ // value to grab for event listener
            .classed("active", true)
            .text("Years");

        // label for y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height))
            .attr("dy", "1em")
            .attr("stroke", "orange")
            .classed("axis-text", true)
            .text("Number of Top Rated Movies");


        // Step 1: Append a div to the body to create tooltips, assign it a class
        // =======================================================
        var toolTip = d3.select("body").append("div")
            .attr("class", "tooltip");

        // Step 2: Add an onmouseover event to display a tooltip
        // ========================================================
        circlesGroup.on("mouseover", function (d, num) {
            toolTip.style("display", "block");
            toolTip.html(`Top rated movie(s): <strong>${d.num}</strong> Year: <strong>${d.year}</strong> `)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        })
            // Step 3: Add an onmouseout event to make the tooltip invisible
            .on("mouseout", function () {
                toolTip.style("display", "none");
            })

    })
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);
