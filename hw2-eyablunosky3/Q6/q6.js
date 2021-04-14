//Width and height
var pad = {
    left: 50,
    right: 150,
    top: 100,
    bottom: 50
}
var mapWidth = 850;
var mapHeight = 500;
var h = pad.top + pad.bottom + mapHeight;
var w = pad.left + mapWidth + pad.right;

var us = {};
var ed = d3.map();
var edDetails = d3.map();

var setEducation = function (d){
    d.forEach(function (d){
        ed.set(+d['id'], {
            State: d['State'],
            name: d['name'],
            percent_educated: +d['percent_educated']
        });
    });
}

var setEducationDetails = function (d){
    d.forEach(function (d){
        if (d[0] != ''){
            edDetails.set(+d['id'], {
                qualified_professionals: d['qualified_professionals'],
                high_school: d['high_school'],
                middle_school_or_lower: d['middle_school_or_lower']
            });
        }
    });
}



var svg = d3.select('#q6-target')
    .append('svg')
    .attr('id', 'us-map')
    .attr('width', w)
    .attr('height', h);

var path = d3.geo.path();

var purples = ['#fdfcfc','#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d']
var colorScale = d3.scale.threshold()
    .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
    .range(purples);

var tooltip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var education = ed.get(d.id);
    var details = edDetails.get(d.id);
    var html =  "County: " + education.name + "</br>" +
                "Percent Educated: " + d3.format('.2%')(education.percent_educated/100) + "</br>" +
                "Qualified Professionsals: " + (details.qualified_professionals) + "</br>" +
                "High School graduates: " + (details.high_school) + "</br>" +
                "Middle School or lower graduates: " + (details.middle_school_or_lower);

    return  html;
  });

svg.call(tooltip);

var init = function(){

    var pctInterval = 10;
    for(i=0; i<10; i++){
        svg
            .append('rect')
            .attr('width', '25')
            .attr('height', '25')
            .attr('x', w - pad.right + 25)
            .attr('y', pad.top + (i * 25) + 100)
            .attr('fill', function() { 
                return (purples[i] || purples[8]);
            });
        svg
            .append('text')
            .attr('x', w - pad.right + 55)
            .attr('y', pad.top + (i * 25) + 115)
            .attr('text-anchor', 'start')
            .text(
                '' + (i * pctInterval) + '%'
                );
        }

    d3.queue()
        .defer(d3.json, './us.json')
        .defer(d3.csv, './education.csv')
        .defer(d3.csv, './education_details.csv')
        .await(drawMap);
    }

var drawMap = function (error, us_json, ed_csv, edDetails_csv) {
    if (error) console.log('error', error);
    us = us_json;
    setEducation(ed_csv);
    setEducationDetails(edDetails_csv);

    //http://bl.ocks.org/Caged/6476579

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features )        
        .enter()
        .append("path")
        .filter(function(d) {return (ed.keys().indexOf(''+d.id) != -1);})
        .attr("fill", function(d) { 
            return colorScale(ed.get(d.id).percent_educated); 
        })
        .attr("d", path)
        .attr("transform", "translate(" + (pad.left) + "," + (pad.top) + ")")
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("fill", 'none')
        .attr("d", path)
        .attr("transform", "translate(" + (pad.left) + "," + (pad.top) + ")");

    svg.append('text')
        .attr('class', 'title')
        .attr('x',  pad.left + (mapWidth / 2))
        .attr('y', pad.top / 2)
        .style('text-anchor', 'middle')
        .text('EDUCATION STATISTICS');


}


init();