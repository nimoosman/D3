//D3 Homework

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
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

// Import data
var file = "assets/data/data.csv"
d3.csv(file).then(function(data) {

    // Parse data/Cast as numbers
    data.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      // data.abbr = +data.abbr;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.poverty)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "royalblue")
    .attr("opacity", ".5");

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Adding state abbreviations to circles
    var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");
    circleLabels
    .attr("x", function(d) {
      return xLinearScale(d.healthcare);
    })
    .attr("y", function(d) {
      return yLinearScale(d.poverty);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% in Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
  }).catch(function(error) {
    console.log(error);
  });
