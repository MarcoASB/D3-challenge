// @TODO: YOUR CODE HERE!

//Starting parameters
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// Appends
var chart = d3
    .select('#scatter')
    .append('div')
    .classed('chart', true)

let svg = chart
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

let chartGroup = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


// Default parameters
let SelectXAxis = 'poverty';
let SelectYAxis = 'healthcare';


// Update X Scale 
function xScale(censusData, SelectXAxis) {
    let xLinearScale = d3
      .scaleLinear()
      .domain([d3.min(censusData, d => d[SelectXAxis]) * 0.8,
        d3
        .max(censusData, d => d[SelectXAxis]) * 1.2])
        .range([0, width]);
    return xLinearScale;
}


// Update Y Scale
function yScale(censusData, SelectYAxis) {
  let yLinearScale = d3
    .scaleLinear()
    .domain([d3.min(censusData, d => d[SelectYAxis]) * 0.8,
      d3
      .max(censusData, d => d[SelectYAxis]) * 1.2])
      .range([height, 0]);
  return yLinearScale;
}


// Update X Axis
function renderX(newXScale, xAxis) {
  let bottomAxis = d3
  .axisBottom(newXScale);
  xAxis
    .transition()
    .duration(2000)
    .call(bottomAxis);
  return xAxis;
}


// Update Y Axis
function renderY(newYScale, yAxis) {
  var leftAxis = d3
  .axisLeft(newYScale);
  yAxis
    .transition()
    .duration(2000)
    .call(leftAxis);
  return yAxis;
}


// Update Circles
function renderCircles(circlesGroup, newXScale, SelectXAxis, newYScale, SelectYAxis) {
    circlesGroup
      .transition()
      .duration(2000)
      .attr('cx', data => newXScale(data[SelectXAxis]))
      .attr('cy', data => newYScale(data[SelectYAxis]))
    return circlesGroup;
}


// Update Text
function renderText(textGroup, newXScale, SelectXAxis, newYScale, SelectYAxis) {
    textGroup
      .transition()
      .duration(2000)
      .attr('x', d => newXScale(d[SelectXAxis]))
      .attr('y', d => newYScale(d[SelectYAxis]));
    return textGroup
}


// Update  X Style
function styleX(value, SelectXAxis) {
    if (SelectXAxis === 'poverty') {
        return `${value}%`;
    }
    else if (SelectXAxis === 'income') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}


// Update Circles
function UpdateCircles(SelectXAxis, SelectYAxis, circlesGroup) {
    if (SelectXAxis === 'poverty') {
      var xLabel = 'Poverty:';
    }
    else if (SelectXAxis === 'income'){
      var xLabel = 'Median Income:';
    }
    else {
      var xLabel = 'Median Age:';
    }
  if (SelectYAxis ==='healthcare') {
    var yLabel = "Healthcare Lack:"
  }
  else if(SelectYAxis === 'obesity') {
    var yLabel = 'Obesity:';
  }
  else{
    var yLabel = 'Smokes:';
  }
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${styleX(d[SelectXAxis], SelectXAxis)}<br>${yLabel} ${d[SelectYAxis]}%`);
  });

  circlesGroup.call(toolTip);
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}


// Get Data
d3.csv('./assets/data/data.csv').then(function(censusData) {
    console.log(censusData);   
    censusData.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    var xLinearScale = xScale(censusData, SelectXAxis);
    var yLinearScale = yScale(censusData, SelectYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup
      .append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup
      .append('g')
      .classed('y-axis', true)
      .call(leftAxis);

    var circlesGroup = chartGroup
      .selectAll('circle')
      .data(censusData)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', d => xLinearScale(d[SelectXAxis]))
      .attr('cy', d => yLinearScale(d[SelectYAxis]))
      .attr('r', 20)
      .attr('opacity', '.5');

    var textGroup = chartGroup
      .selectAll('.stateText')
      .data(censusData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[SelectXAxis]))
      .attr('y', d => yLinearScale(d[SelectYAxis]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});

    var xLabelsGroup = chartGroup
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var povertyLabel = xLabelsGroup
      .append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .text('In Poverty (%)');
      
    var ageLabel = xLabelsGroup
      .append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age')
      .text('Age (Median)');  

    var incomeLabel = xLabelsGroup
      .append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income')
      .text('Household Income (Median)')

    var yLabelsGroup = chartGroup
      .append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcareLabel = yLabelsGroup
      .append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'healthcare')
      .text('Lacks Healthcare (%)');
    
    var smokesLabel = yLabelsGroup
      .append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'smokes')
      .text('Smokes (%)');
    
    var obesityLabel = yLabelsGroup
      .append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'obesity')
      .text('Obese (%)');
    var circlesGroup = UpdateCircles(SelectXAxis, SelectYAxis, circlesGroup);
    xLabelsGroup
      .selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');
        if (value != SelectXAxis) {
          SelectXAxis = value; 
          xLinearScale = xScale(censusData, SelectXAxis);
          xAxis = renderX(xLinearScale, xAxis);
          circlesGroup = renderCircles(circlesGroup, xLinearScale, SelectXAxis, yLinearScale, SelectYAxis);
          textGroup = renderText(textGroup, xLinearScale, SelectXAxis, yLinearScale, SelectYAxis);
          circlesGroup = UpdateCircles(SelectXAxis, SelectYAxis, circlesGroup);
          if (SelectXAxis === 'poverty') {
            povertyLabel
              .classed('active', true)
              .classed('inactive', false);
            ageLabel.classed('active', false)
              .classed('inactive', true);
            incomeLabel.classed('active', false)
              .classed('inactive', true);
          }
          else if (SelectXAxis === 'age') {
            povertyLabel
              .classed('active', false)
              .classed('inactive', true);
            ageLabel
              .classed('active', true)
              .classed('inactive', false);
            incomeLabel
              .classed('active', false)
              .classed('inactive', true);
          }
          else {
            povertyLabel
              .classed('active', false)
              .classed('inactive', true);
            ageLabel
              .classed('active', false)
              .classed('inactive', true);
            incomeLabel
              .classed('active', true)
              .classed('inactive', false);
          }
        }
      });

    yLabelsGroup
      .selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');
        if(value !=SelectYAxis) {
          SelectYAxis = value;
            yLinearScale = yScale(censusData, SelectYAxis);
            yAxis = renderY(yLinearScale, yAxis);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, SelectXAxis, yLinearScale, SelectYAxis);
            textGroup = renderText(textGroup, xLinearScale, SelectXAxis, yLinearScale, SelectYAxis);
            circlesGroup = UpdateCircles(SelectXAxis, SelectYAxis, circlesGroup);
            if (SelectYAxis === 'obesity') {
              obesityLabel
                .classed('active', true)
                .classed('inactive', false);
              smokesLabel
                .classed('active', false)
                .classed('inactive', true);
              healthcareLabel
                .classed('active', false)
                .classed('inactive', true);
            }
            else if (SelectYAxis === 'smokes') {
              obesityLabel
                .classed('active', false)
                .classed('inactive', true);
              smokesLabel
                .classed('active', true)
                .classed('inactive', false);
              healthcareLabel
                .classed('active', false)
                .classed('inactive', true);
            }
            else {
              obesityLabel
                .classed('active', false)
                .classed('inactive', true);
              smokesLabel
                .classed('active', false)
                .classed('inactive', true);
              healthcareLabel
                .classed('active', true)
                .classed('inactive', false);
            }
          }
        });
});