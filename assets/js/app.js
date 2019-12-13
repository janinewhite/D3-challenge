// Text control
function capitalizeFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
}
function titleCase(text) {
    text_split = text.toLowerCase().split(" ");
    return text_split.map(x => capitalizeFirstLetter(x)).join(" ");
}

// Initialize variables
var dataFile = "https://raw.githubusercontent.com/janinewhite/D3-challenge/master/assets/db/data.csv"
var csvData;
var xAxis = "age";
var yAxis = "income";
//var xVar, yVar;
var clicks = 0;

// Create selection event handlers
var selectX = d3.select(".select-x");
selectX.on("change", function(){
    xAxis = d3.event.target.value;
    console.log("X axis selected: "+xAxis);
});
var selectY = d3.select(".select-y");
selectY.on("change", function(){
    yAxis = d3.event.target.value;
    console.log("Y axis selected: "+yAxis);
});

// Initialize svg
var margin = {
  top: 10,
  right: 40,
  bottom: 60,
  left: 60
};
//var svgWidth = +d3.select('.chart').style('width').slice(0, -2) - margin.left - margin.right;
var svgWidth = 400;
var svgHeight = svgWidth - ((margin.left + margin.right) - (margin.top + margin.bottom));

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Get Data
var xData, yData;
var xMin, xMax, yMin, yMax;
d3.csv(dataFile).then(csvData => {
    //csvData = data;
    csvData.forEach(row => {
        row.income = +row.income;
        row.age = +row.age;
        row.poverty = +row.poverty;
        row.healthcare = +row.healthcare;
        row.obesity = +row.obesity;
        row.smokes = +row.smokes;
    });
    
    // Button event handler
    var graphButton = d3.select(".graph-button");
        graphButton.on("click",function(){
        console.log("Number of button clicks: "+clicks)
        clicks += 1
        console.log("Graphing "+xAxis+" vs "+yAxis)
        // Set chart title
        d3.select(".chart-title").text("US States: "+titleCase(xAxis)+" vs "+titleCase(yAxis));
        switch(xAxis){
            case "income":
                xMin = d3.min(csvData, function(d) {return d.income});
                xMax = d3.max(csvData, function(d) {return d.income});
                break;
            case "age":
                xMin = d3.min(csvData, function(d) {return d.age});
                xMax = d3.max(csvData, function(d) {return d.age});
                break;
            case "poverty":
                xMin = d3.min(csvData, function(d) {return d.poverty});
                xMax = d3.max(csvData, function(d) {return d.poverty});
                break;
            case "healthcare":
                xMin = d3.min(csvData, function(d) {return d.healthcare});
                xMax = d3.max(csvData, function(d) {return d.healthcare});
                break;
            case "obesity":
                xMin = d3.min(csvData, function(d) {return d.obesity});
                xMax = d3.max(csvData, function(d) {return d.obesity});
                break;
            case "smokes":
                xMin = d3.min(csvData, function(d) {return d.smokes});
                xMax = d3.max(csvData, function(d) {return d.smokes});
                break;
        }
        switch(yAxis){
            case "income":
                yMin = d3.min(csvData, function(d) {return d.income});
                yMax = d3.max(csvData, function(d) {return d.income});
                break;
            case "age":
                yMin = d3.min(csvData, function(d) {return d.age});
                yMax = d3.max(csvData, function(d) {return d.age});
                break;
            case "poverty":
                yMin = d3.min(csvData, function(d) {return d.poverty});
                yMax = d3.max(csvData, function(d) {return d.poverty});
                break;
            case "healthcare":
                yMin = d3.min(csvData, function(d) {return d.healthcare});
                yMax = d3.max(csvData, function(d) {return d.healthcare});
                break;
            case "obesity":
                yMin = d3.min(csvData, function(d) {return d.obesity});
                yMax = d3.max(csvData, function(d) {return d.obesity});
                break;
            case "smokes":
                yMin = d3.min(csvData, function(d) {return d.smokes});
                yMax = d3.max(csvData, function(d) {return d.smokes});
                break;
        }
        console.log(xAxis+" X Min: "+xMin);
        console.log(xAxis+" X Max: "+xMax);
        console.log(yAxis+" Y Min: "+yMin);
        console.log(yAxis+" Y Max: "+yMax);
        
        // Clear svg
        svg.selectAll("*").remove();
        // Append svg group to hold chart
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        // Create axes
        var xLinearScale = d3.scaleLinear()
            .domain([xMin*0.95,xMax])
            .range([0, width]);
        var yLinearScale = d3.scaleLinear()
            .domain([yMin*0.95,yMax])
            .range([height, 0]);
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        chartGroup.append("g")
            .call(leftAxis);
    
        // Label axes
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text(titleCase(yAxis));
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text(titleCase(xAxis));
    
        // initialize tooltips
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                let state = d.state;
                let state_abbr = d.abbr.toUpperCase();
                let first_data = eval("+d."+xAxis);
                let second_data = eval("+d."+yAxis);
                let first_axis = titleCase(xAxis);                
                let second_axis = titleCase(yAxis);
                console.log("Tip - "+d.abbr+" "+xAxis+": "+first_data+", "+yAxis+": "+second_data);
                return (`State: ${state} (${state_abbr})<br/>${first_axis}: ${first_data}<br/>${second_axis}: ${second_data}`);
            });
        // create tooltip
        svg.call(toolTip);

        // Create circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(csvData)
            .enter()
            .append("circle")
            .attr("cx", d => {
                let circleX;
                eval("circleX = +d."+xAxis+";");
                let circleXtrans = xLinearScale(circleX);
                console.log("Circle X - "+d.abbr+" "+xAxis+": "+circleX+", scaled "+circleXtrans);
                return circleXtrans;
            })
            .attr("cy", d => {
                let circleY;
                eval("circleY = +d."+yAxis+";");
                let circleYtrans = yLinearScale(circleY);
                console.log("Circle Y - "+d.abbr+" "+xAxis+": "+circleY+", scaled "+circleYtrans);
                return circleYtrans;
            })
            .attr("r", "10")
            .attr("fill", "blue")
            .attr("opacity", ".5")
            .on('mouseover',toolTip.show)
            .on('mouseout',toolTip.hide);
        var textGroup = chartGroup.selectAll(".text-in-circle")
            .data(csvData)
            .enter()
            .append("text")            
            .text(d => d.abbr)
            .attr("dx", d => {
                let xVarText;
                eval("xVarText = +d."+xAxis+";");
                let textX = xLinearScale(xVarText)-6;
                console.log("Text X - "+d.abbr+" "+xAxis+": "+xVarText+", scaled "+textX);
                return textX;
            })
            .attr("dy", d => {
                let yVarText;
                eval("yVarText = +d."+yAxis+";");
                let textY = yLinearScale(yVarText)+4;
                console.log("Text Y - "+d.abbr+" "+yAxis+": "+yVarText+", scaled "+textY);
                return textY;
            })
            .attr("class","text-in-circle")
            .style("font-size", 8)
            .style("font-weight", "bold")
            .style("fill","white")
            ;
    });
    
    
    // If button hasn't been clicked, send click event to populate chart using default selections.
    if (clicks == 0) {
        document.getElementById('graph-button').click();
    }
}).catch(error => console.log(error));

