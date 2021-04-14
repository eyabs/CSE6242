//Width and height
var pad = {
    left: 150,
    right: 20,
    top: 20,
    bottom: 70
}
var barHeight = 30;
var barchartWidth = 475;
var barchartHeight = 5 * (barHeight + 5);
var growthChartSize = 175;
var h = pad.top + pad.bottom + barchartHeight;
var w = pad.left + barchartWidth + 50 + growthChartSize + pad.right;

var data = [{city: 'San Antonio', population_2012: 1383505, growth: {year_2013:25405, year_2014:26644 , year_2015:28593 , year_2016:23591 , year_2017:24208}},
{city: 'New York', population_2012: 8383504, growth: {year_2013:75138 , year_2014:62493 , year_2015:61324 , year_2016:32967 , year_2017:7272}},
{city: 'Chicago', population_2012: 2717989, growth: {year_2013:6493 , year_2014:2051 , year_2015:-1379 , year_2016:-4879 , year_2017:-3825}},
{city: 'Los Angeles', population_2012: 3859267, growth:{year_2013:32516 , year_2014:30885 , year_2015:30791 , year_2016:27657 , year_2017:18643}},
{city: 'Phoenix', population_2012: 1495880, growth: {year_2013:25302 , year_2014:26547 , year_2015:27310 , year_2016:27003 , year_2017:24036}}
];

var svg = d3.select('body')
    .append('svg')
    .attr('id', 'citychart')
    .attr('width', w)
    .attr('height', h);

var init = function(){
    data.forEach(function(x) {
        x['population'] = x.population_2012 + x.growth.year_2013 + x.growth.year_2014 + x.growth.year_2015 + x.growth.year_2016 + x.growth.year_2017;
    })
    data = data.sort(function(x, y){return d3.descending(x.population, y.population)});
    
    drawBarchart();
}

var drawBarchart = function () {
    var maxPop = d3.max(data, function(d){ return d.population});
    
    var xScale = d3.scale.linear()
        .domain([0, maxPop])
        .range([0, barchartWidth]);

    var yScale = d3.scale.ordinal()
        .domain(data.map(d => d.city))
        .rangePoints([pad.top,h - pad.bottom - barHeight]);
    //d3.select('#interactive svg').remove();


    
    var rect = svg.selectAll('rect');

    rect.data(data)
        .enter()
        .append('rect')
        .attr('class', 'hoverable')
        .attr('x', pad.left)
        .attr('y', function(d) {return yScale(d.city)})
        .attr('width', function(d) {return xScale(d.population)})
        .attr('height', barHeight)
        .attr('rx', 5)
        .attr('ry', 5)
        .on('mouseover', drawGrowthChart)
        .on('mouseout', removeGrowthChart);

    var txt = svg.selectAll('text');
    txt.data(data)
        .enter()
        .append('text')
        .attr('x', pad.left - 5)
        .attr('y', function(d) {return yScale(d.city);})
        .attr('dy', '1.25em')
        .attr('text-anchor', 'end')
        .text(function(d){return d.city});

    txt.data(data)
        .enter()
        .append('text')
        .attr('x', pad.left + 5)
        .attr('y', function(d) {return yScale(d.city);})
        .attr('dy', '1.25em')
        .attr('text-anchor', 'start')
        .style('fill', '#EEE')
        .text(function(d){return d3.format(',')(d.population)});

    var city = data[1];


}

var drawGrowthChart = function(city) {
    var growthRates = [
        [2013, (city.growth.year_2013/(city.population_2012 )) * 100], 
        [2014, (city.growth.year_2014/(city.population_2012 + city.growth.year_2013  )) * 100], 
        [2015, (city.growth.year_2015/(city.population_2012 + city.growth.year_2013 + city.growth.year_2014 )) * 100], 
        [2016, (city.growth.year_2016/(city.population_2012 + city.growth.year_2013 + city.growth.year_2014 + city.growth.year_2015)) * 100], 
        [2017, (city.growth.year_2017/(city.population_2012 + city.growth.year_2013 + city.growth.year_2014 + city.growth.year_2015 + city.growth.year_2016)) * 100]
    ];

    var minGrowth = d3.min(growthRates, function(d){ return d[1]});
    var maxGrowth = d3.max(growthRates, function(d){ return d[1]});
    
    var xScale = d3.scale.linear()
        .domain([2013, 2017])
        .range([w - pad.right - growthChartSize, w - pad.right]);

    var yScale = d3.scale.linear()
        .domain([minGrowth, maxGrowth])
        .range([pad.top + growthChartSize, pad.top]);

        //Define X axis
    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .tickFormat(d3.format('.0f'))
                      .ticks(5);

    //Define Y axis
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .tickFormat(d3.format('.2f'))
                      .ticks(6);

    var line = d3.svg.line()
        .x(function(d){ return xScale(d[0])})
        .y(function(d){ return yScale(d[1])});

    svg.append('path')
        .attr('class', 'line')
        .attr('class', 'delete-on-mouseout delete-on-mouseout')
        .attr('d', line(growthRates));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis delete-on-mouseout")
        .attr('transform', 'translate(0,' + (pad.top + growthChartSize) + ')')
        .call(xAxis);
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis delete-on-mouseout")
        .attr('transform', 'translate(' + (w - pad.right - growthChartSize) + ',0)')
        .call(yAxis);

    svg.append('text')
        .attr('class', 'delete-on-mouseout')
        .attr('x', w - pad.right - growthChartSize - 5)
        .attr('y', pad.top - 10)
        .attr('text-anchor', 'end')
        .text('Pct %')

    svg.append('text')
        .attr('class', 'delete-on-mouseout')
        .attr('x', w - pad.right )
        .attr('y', pad.top + growthChartSize + 30)
        .attr('text-anchor', 'end')
        .text('Year')

}

var removeGrowthChart = function(city) {
    d3.selectAll('.delete-on-mouseout').remove();
}

init();