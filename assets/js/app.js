//Text
function capitalizeFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
}
function titleCase(text) {
    text_split = text.toLowerCase().split(" ");
    return text_split.map(x => capitalizeFirstLetter(x)).join(" ");
}

var dataFile = "https://raw.githubusercontent.com/janinewhite/D3-challenge/master/assets/db/data.csv"
var csvData;
var xAxis = "age";
var yAxis = "income";
var xVar, yVar;

var selectX = d3.select(".select-x");
selectX.on("change", function(){
    xAxis = d3.event.target.value;
    console.log("X Axis: "+xAxis);
});
var selectY = d3.select(".select-y");
selectY.on("change", function(){
    yAxis = d3.event.target.value;
    console.log("Y Axis: "+yAxis);
});
var graphButton = d3.select(".graph-button");

var svgWidth = 400;
var svgHeight = 300;
var margin = {
  top: 10,
  right: 40,
  bottom: 60,
  left: 60
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

d3.csv(dataFile).then(data => {
    csvData = data;
    csvData.forEach(data => {
        data.income = +data.income;
        data.age = +data.age;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    graphButton.on("click",function(){
        console.log("Graphing "+xAxis+" vs "+yAxis)
        // Clear svg
        svg.selectAll("*").remove();
        // Append svg group to hold chart
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        // Set chart title
        d3.select(".chart-title").text("US States: "+titleCase(xAxis)+" vs "+titleCase(yAxis))
        // Create axes
        let xLinearScale = d3.scaleLinear()
            .domain([
                d3.min(csvData, d => {
                    eval("xVar = d."+xAxis+";")
                    return xVar;
                })*0.95, 
                d3.max(csvData, d => {
                    eval("xVar = d."+xAxis+";")
                    return xVar;
                })
            ])
            .range([0, width]);
        let yLinearScale = d3.scaleLinear()
            .domain([
                d3.min(csvData, d => {
                    eval("yVar = d."+yAxis+";")
                    return yVar;
                })*0.95,
                d3.max(csvData, d => {
                    eval("yVar = d."+yAxis+";")
                    return yVar;
                })
            ])
            .range([height, 0]);
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);
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
        let toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`State: ${(d.abbr).toUpperCase()}<br>${titleCase(xAxis)}: ${xVar}<br>${titleCase(yAxis)}: ${yVar}`);
            });
        // create tooltip
        svg.call(toolTip);

        // Create circles
        let circlesGroup = chartGroup.selectAll("circle")
            .data(csvData)
            .enter()
            .append("circle")
            .attr("cx", d => {            
                eval("xVar = d."+xAxis+";");
                return xLinearScale(xVar);
            })
            .attr("cy", d => {            
                eval("yVar = d."+yAxis+";");
                return yLinearScale(yVar);
            })
            .attr("r", "10")
            .attr("fill", "blue")
            .attr("opacity", ".5")
            .on('mouseover',toolTip.show)
            .on('mouseout',toolTip.hide);
        let textGroup = chartGroup.selectAll("text")
            .data(csvData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("class","text-in-circle")
            .attr("dx", d => {            
                        eval("xVar = d."+xAxis+";");
                        return xLinearScale(xVar)-6;
            })
            .attr("dy", d => {            
                        eval("yVar = d."+yAxis+";");
                        return yLinearScale(yVar)+4;
            })
            .attr("font-size", 8)
            .attr("font-weight", "bold")
            .attr("opacity", ".75");
    }); 
}).catch(error => console.log(error));