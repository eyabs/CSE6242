//Width and height

 var w = 650;
 var h = 500;
 var padding = {
    left: 50,
    right: 150,
    top: 50,
    bottom: 70
}
//Dynamic, random dataset1
// var numDataPoints = 100;
// var xRange = [10, 250];
// var yRange = [10, 250];
// for (var i = 0; i < numDataPoints; i++) { 
//     var x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
//     var y = Math.random() * (yRange[1] - yRange[0]) + yRange[0];
//     dataset1.push([x, y]);
// }

d3.csv('./movies.csv', function (d) {
    var dataset = []
    d.forEach(function (record) {
        dataset.push({
            imdbRating: parseFloat(record.imdbRating),
            imdbVotes: parseFloat(record.imdbVotes),
            WinsNoms: parseFloat(record.WinsNoms),
            Budget: parseFloat(record.Budget),
            IsGoodRating: record.IsGoodRating
        });
    });
    createGraphs(dataset);
});


var createGraphs = function (dataset) {

    var colorScale = d3.scale.ordinal()
        .domain(['0', '1'])
        .range(['#F00', '#00F']);
    var shapeScale = d3.scale.ordinal()
        .domain(['0', '1'])
        .range(['circle', 'cross']);
    var shapeGenerator = function (shape, size) {
        return d3.svg.symbol().type(shape).size(size)();
    }

    // -----------------------------------
    //  First Graph
    // -----------------------------------

    var minX = d3.min(d3.values(dataset), function (d) { return d.imdbRating; });
    var maxX = d3.max(d3.values(dataset), function (d) { return d.imdbRating; });
    var minY = d3.min(d3.values(dataset), function (d) { return d.WinsNoms; });
    var maxY = d3.max(d3.values(dataset), function (d) { return d.WinsNoms; });

    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([minX, maxX])
        .range([padding.left, w - padding.right]);

    var yScale = d3.scale.linear()
        .domain([minY, maxY])
        .range([h - padding.bottom, padding.top]);

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10);
    //Create SVG element
    var svg = d3.select('#scatterplot1')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    //Create points
    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + xScale(d.imdbRating) + ',' + yScale(d.WinsNoms) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale(d.IsGoodRating), 20);
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale(d.IsGoodRating);
        })

    //Create X axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (h - padding.bottom) + ')')
        .call(xAxis);
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScale(minY - ((maxY - minY) / 7)))
        .style('text-anchor', 'middle')
        .text('IMDB Rating');

    //Create Y axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',0)')
        .call(yAxis);

    svg.append('text')
        .style('text-anchor', 'middle')
        .attr('x', -200) //xScale(minX) - 40)
        .attr('y', 15) //yScale((maxY + minY) / 2))
        .text('Wins+Noms')
        .attr('transform', 'rotate(-90)');

    // Title
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScale(1.1 * maxY))
        .style('text-anchor', 'middle')
        .text('Wins+Nominations vs. IMDb Rating');

    // Legend
    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScale(maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('1'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('1');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScale(maxY)+5)
        .style('text-anchor', 'start')
        .text('Good Rating')

    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScale(0.9*maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('0'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('0');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScale(0.9*maxY)+5)
        .style('text-anchor', 'start')
        .text('Bad Rating')


    // -----------------------------------
    //  Second Graph
    // -----------------------------------

    var minX = d3.min(d3.values(dataset), function (d) { return d.imdbRating; });
    var maxX = d3.max(d3.values(dataset), function (d) { return d.imdbRating; });
    var minY = d3.min(d3.values(dataset), function (d) { return d.Budget; });
    var maxY = d3.max(d3.values(dataset), function (d) { return d.Budget; });

    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([minX, maxX])
        .range([padding.left, w - padding.right]);

    var yScale = d3.scale.linear()
        .domain([minY, maxY])
        .range([h - padding.bottom, padding.top]);

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(d3.format('.2s'))
        .ticks(10);

    //Create SVG element
    var svg = d3.select('#scatterplot2')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    //Create points
    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + xScale(d.imdbRating) + ',' + yScale(d.Budget) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale(d.IsGoodRating), 20);
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale(d.IsGoodRating);
        })

    //Create X axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (h - padding.bottom) + ')')
        .call(xAxis);
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScale(minY - ((maxY - minY) / 7)))
        .style('text-anchor', 'middle')
        .text('IMDB Rating');

    //Create Y axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',0)')
        .call(yAxis);

    svg.append('text')
        .style('text-anchor', 'middle')
        .attr('x', -200) //xScale(minX) - 40)
        .attr('y', 15) //yScale((maxY + minY) / 2))
        .text('Budget')
        .attr('transform', 'rotate(-90)');

    // Title
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScale(1.1 * maxY))
        .style('text-anchor', 'middle')
        .text('Budget vs. IMDb Rating');

    // Legend
    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScale(maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('1'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('1');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScale(maxY)+5)
        .style('text-anchor', 'start')
        .text('Good Rating')

    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScale(0.9*maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('0'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('0');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScale(0.9*maxY)+5)
        .style('text-anchor', 'start')
        .text('Bad Rating')



    // -----------------------------------
    //  Third Graph
    // -----------------------------------

    var minX = d3.min(d3.values(dataset), function (d) { return d.imdbRating; });
    var maxX = d3.max(d3.values(dataset), function (d) { return d.imdbRating; });
    var minY = d3.min(d3.values(dataset), function (d) { return d.imdbVotes; });
    var maxY = d3.max(d3.values(dataset), function (d) { return d.imdbVotes; });
    var minSize = d3.min(d3.values(dataset), function (d) { return d.WinsNoms; });
    var maxSize = d3.max(d3.values(dataset), function (d) { return d.WinsNoms; });

    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([minX, maxX])
        .range([padding.left, w - padding.right]);

    var yScale = d3.scale.linear()
        .domain([minY, maxY])
        .range([h - padding.bottom, padding.top]);

    var sizeScale = d3.scale.linear()
        .domain([minSize, maxSize])
        .range([10, 100])

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(d3.format('.2s'))
        .ticks(10);

    //Create SVG element
    var svg = d3.select('#scatterplot3')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    //Create points
    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + xScale(d.imdbRating) + ',' + yScale(d.imdbVotes) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale(d.IsGoodRating), sizeScale(d.WinsNoms));
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale(d.IsGoodRating);
        })

    //Create X axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (h - padding.bottom) + ')')
        .call(xAxis);
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScale(minY - ((maxY - minY) / 7)))
        .style('text-anchor', 'middle')
        .text('IMDB Rating');

    //Create Y axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',0)')
        .call(yAxis);

    svg.append('text')
        .style('text-anchor', 'middle')
        .attr('x', -200) //xScale(minX) - 40)
        .attr('y', 15) //yScale((maxY + minY) / 2))
        .text('IMDb Votes')
        .attr('transform', 'rotate(-90)');

    // Title
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScale(1.1 * maxY))
        .style('text-anchor', 'middle')
        .text('Votes vs. IMDb Rating sized by Wins+Nominations');

    // Legend
    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScale(maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('1'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('1');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScale(maxY)+5)
        .style('text-anchor', 'start')
        .text('Good Rating')

    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScale(0.9*maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('0'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('0');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScale(0.9*maxY)+5)
        .style('text-anchor', 'start')
        .text('Bad Rating')


    // -----------------------------------
    //  Fourth Graph
    // -----------------------------------

    var minX = d3.min(d3.values(dataset), function (d) { return d.imdbRating; });
    var maxX = d3.max(d3.values(dataset), function (d) { return d.imdbRating; });
    var minY = d3.min(d3.values(dataset), function (d) { return d.WinsNoms; });
    var maxY = d3.max(d3.values(dataset), function (d) { return d.WinsNoms; });

    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([minX, maxX])
        .range([padding.left, w - padding.right]);

    var yScale = d3.scale.sqrt()
        .domain([minY, maxY])
        .range([h - padding.bottom, padding.top]);

    // For aliging non-data elements
    var yScaleLinear = d3.scale.linear()
        .domain([minY, maxY])
        .range([h - padding.bottom, padding.top]);

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10);
    //Create SVG element
    var svg = d3.select('#scatterplot4')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    //Create points
    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + xScale(d.imdbRating) + ',' + yScale(d.WinsNoms) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale(d.IsGoodRating), 20);
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale(d.IsGoodRating);
        })

    //Create X axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (h - padding.bottom) + ')')
        .call(xAxis);
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScaleLinear(minY - ((maxY - minY) / 7)))
        .style('text-anchor', 'middle')
        .text('IMDB Rating');

    //Create Y axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',0)')
        .call(yAxis);

    svg.append('text')
        .style('text-anchor', 'middle')
        .attr('x', -200) //xScale(minX) - 40)
        .attr('y', 15) //yScale((maxY + minY) / 2))
        .text('Wins+Noms')
        .attr('transform', 'rotate(-90)');

    // Title
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScaleLinear(1.1 * maxY))
        .style('text-anchor', 'middle')
        .text('Wins+Nominations (square-root-scaled) vs. IMDb Rating');

    // Legend
    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScaleLinear(maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('1'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('1');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScaleLinear(maxY)+5)
        .style('text-anchor', 'start')
        .text('Good Rating')

    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScaleLinear(0.9*maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('0'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('0');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScaleLinear(0.9*maxY)+5)
        .style('text-anchor', 'start')
        .text('Bad Rating')


    // -----------------------------------
    //  Fifth Graph
    // -----------------------------------

    var minX = d3.min(d3.values(dataset), function (d) { return d.imdbRating; });
    var maxX = d3.max(d3.values(dataset), function (d) { return d.imdbRating; });
    var minY = d3.min(d3.values(dataset), function (d) { return d.WinsNoms; });
    var maxY = d3.max(d3.values(dataset), function (d) { return d.WinsNoms; });

    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([minX, maxX])
        .range([padding.left, w - padding.right]);

    var yScale = d3.scale.log()
        .domain([minY+1, maxY+1])
        .range([h - padding.bottom, padding.top]);

    // For aliging non-data elements
    var yScaleLinear = d3.scale.linear()
        .domain([minY, maxY])
        .range([h - padding.bottom, padding.top]);

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(d3.format('.2s'))
        .orient('left')
        .ticks(5);

    //Create SVG element
    var svg = d3.select('#scatterplot5')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    //Create points
    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + xScale(d.imdbRating) + ',' + yScale(d.WinsNoms+1) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale(d.IsGoodRating), 20);
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale(d.IsGoodRating);
        })

    //Create X axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (h - padding.bottom) + ')')
        .call(xAxis);
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScaleLinear(minY - ((maxY - minY) / 7)))
        .style('text-anchor', 'middle')
        .text('IMDB Rating');

    //Create Y axis
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',0)')
        .call(yAxis);

    svg.append('text')
        .style('text-anchor', 'middle')
        .attr('x', -200) //xScale(minX) - 40)
        .attr('y', 15) //yScale((maxY + minY) / 2))
        .text('Wins+Noms')
        .attr('transform', 'rotate(-90)');

    // Title
    svg.append('text')
        .attr('x', xScale((maxX + minX) / 2))
        .attr('y', yScaleLinear(1.1 * maxY))
        .style('text-anchor', 'middle')
        .text('Wins+Nominations (log-scaled) vs. IMDb Rating');

    // Legend
    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScaleLinear(maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('1'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('1');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScaleLinear(maxY)+5)
        .style('text-anchor', 'start')
        .text('Good Rating')

    svg.append('path')
        .attr('class', 'point')
        .attr('transform', function (d) {
            return 'translate(' + (xScale(maxX) + 10) + ',' + yScaleLinear(0.9*maxY) + ')';
        })
        .attr('d', function (d) {
            return shapeGenerator(shapeScale('0'), 20)
        })
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            return colorScale('0');
        })
    svg.append('text')
        .attr('x', xScale(maxX) + 20)
        .attr('y', yScaleLinear(0.9*maxY)+5)
        .style('text-anchor', 'start')
        .text('Bad Rating')

}