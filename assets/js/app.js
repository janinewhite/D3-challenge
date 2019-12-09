var dataFile = "https://raw.githubusercontent.com/janinewhite/D3-challenge/master/assets/db/data.csv"
var csvData;
var svgWidth = 400;
var svgHeight = 300;

var margin = {
  top: 10,
  right: 40,
  bottom: 60,
  left: 75
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
    
    let xAxis = "age";
    let yAxis = "income";
    let xVar, yVar;

    // Create axes
    let xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(csvData, d => {
            eval("xVar = d."+xAxis+";")
            return xVar;
        })])
        .range([0, width]);
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(csvData, d => {
            eval("yVar = d."+yAxis+";")
            return yVar;
        })])
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
      .text(yAxis.toUpperCase());
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text(xAxis.toUpperCase());

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
        .attr("r", "3")
        .attr("fill", "blue")
        .attr("opacity", ".5");
    
        // initialize tooltips
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {return (`State: ${d.abbr}<br>${xAxis}: ${xVar}<br>${yAxis}:${yVar}`);
      });
    
    // create tooltip
    chartGroup.call(toolTip);
    
    // create event listeners for tooltip
    circlesGroup
        .on("click", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
}).catch(error => console.log(error));