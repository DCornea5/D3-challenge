// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .classed('chart',true)
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(data) {
  
  // parse data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    });

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// Create y scale function
var yLinearScale = d3.scaleLinear()
.domain([0, d3.max(data, d => d.healthcare)])
.range([height, 0]);


// // function used for updating y-scale var upon click on axis label
// function yLinearScale(data, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([0,d3.max(data, d => d[chosenYAxis]) * 1.2,
      
//     ])
//     .range([height,0]);

//   return yLinearScale;

// }



// function used for updating xAxis var upon click on axis label
function renderAxes(xLinearScale, xAxis) {
  var bottomAxis = d3.axisBottom(xLinearScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// Initial Params
var chosenXAxis = "poverty",
    chosenYAxis = "healthcare";




  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);
  
  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);



// function used for updating circles group with a transition to
// new circles
function renderCircles(stateCircles, newXScale, chosenXAxis, stateText) {

  stateCircles.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return stateCircles, stateText;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, stateCircles, stateText) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "Poverty (%)";
  }

  else if (chosenXAxis === "age"){
    label = "Age Median";
  }
  else {
    label = "Income";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      // return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      return (`${d.state}<br>${chosenXAxis} ${d[chosenXAxis]}<br>${chosenYAxis} ${d[chosenYAxis]}`);
    });

  stateCircles.call(toolTip);

  stateCircles.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return stateCircles, stateText;
}


  // append initial circles
  
  var stateCircles = chartGroup.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .classed('stateCircle',true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    
    .attr("opacity", ".8");

  // append circles text
  var stateText = chartGroup.selectAll("null")
  .data(data)
  .enter()
  .append("text")
  .classed('stateText',true)

  stateText
  .attr("x", function(d) {
    return xLinearScale(d[chosenXAxis]);
  })
  .attr("y", function(d) {
    return yLinearScale(d[chosenYAxis]);
  })
  .text(function(d) {
    return d.abbr;
  })
  
  
 


  // Create group for x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");   


// // Create group for y-axis labels
// var ylabelsGroup = chartGroup.append("g")
//     .attr("transform", `translate((-40,${height / 2})rotate(-90)`);
//     .attr('value','healthcare')




  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("a-text", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var stateCircles = updateToolTip(chosenXAxis, stateCircles, stateText),
  stateText = updateToolTip(chosenXAxis, stateCircles, stateText);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        stateCircles = renderCircles(chosenXAxis, stateCircles);

        // updates tooltips with new info
        stateCircles = updateToolTip(chosenXAxis, stateCircles);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            }
        
        else if 
            
              (chosenXAxis === "age") {
                povertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
                ageLabel
                  .classed("active", true)
                  .classed("inactive", false);
                incomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
          
        }

        else {
            
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
      }
      }
    });

});