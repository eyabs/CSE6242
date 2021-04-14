//Width and height
var heatmapPad = {
    left: 150,
    right: 150,
    top: 50,
    bottom: 150
}
var boxsize = 50
var heatmapSize = {
 boxsize : 50,
 w : heatmapPad.left + heatmapPad.right + (boxsize*8),
 h : heatmapPad.top + heatmapPad.bottom + (boxsize*7)
};

var alldata = [];

var houses = ['Gryffindor'
    ,'Hufflepuff'
    ,'Ravenclaw'
    ,'Slytherin'];

var books = ["Sorcerer's Stone"
    ,'Chamber of Secrets'
    ,'Prisoner of Azkaban'
    ,'Goblet of Fire'
    ,'Order of the Phoenix'
    ,'Half Blood Prince'
    ,'Deathly Hallows'];

var spellTypes = [
     'Charm'
    ,'Conjuration'
    ,'Counter Spell'
    ,'Curse'
    ,'Healing Spell'
    ,'Hex'
    ,'Jinx'
    ,'Transfiguration'];

var init = function(){

    d3.csv('./heatmap.csv', function (d) {
        d.forEach(function (record) {
            if(record['House']){
                alldata.push({
                     Book: "Sorcerer's Stone",
                     House: record["House"],
                     SpellType : record["SpellType"],
                     Count: +record["Sorcerer's Stone"]
                });
                alldata.push({
                     Book: "Chamber of Secrets",
                     House: record["House"],
                     SpellType : record["SpellType"],
                     Count: +record["Chamber of Secrets"]
                });
                alldata.push({
                     Book: "Prisoner of Azkaban",
                     House: record["House"],
                     SpellType : record["SpellType"],
                     Count: +record["Prisoner of Azkaban"]
                });
                alldata.push({
                     Book: "Goblet of Fire",
                     House: record["House"],
                     SpellType : record["SpellType"],
                     Count: +record["Goblet of Fire"]
                });
                alldata.push({
                     Book: "Order of the Phoenix",
                     House: record["House"],
                     SpellType : record["SpellType"],
                     Count: +record["Order of the Phoenix"]
                });
                alldata.push({
                     Book: "Half Blood Prince",
                     House: record["House"],
                     SpellType : record["SpellType"],
                     Count: +record["Half Blood Prince"]
                });
                alldata.push({
                     Book: "Deathly Hallows",
                     House: record["House"],
                     SpellType : record["SpellType"],
                     Count: +record["Deathly Hallows"]
                });
            }
        });
        var houseSelect = d3.select('#houseSelect')
            .append('select')
            .attr('class', 'select')
            .on('change', updateHeatmap);

        var options = houseSelect
            .selectAll('option')
            .data(houses)
            .enter()
            .append('option')
            .attr('value', function(d) { return d;})
            .text(function(d) { return d;});

        draw(houses[0]);
    });
}

var updateHeatmap = function(){
    var selectedValue = d3.select('#houseSelect select').property('value');
    draw(selectedValue);
}

var draw = function (house) {
    var data = alldata.filter(function(x) { return x.House == house; });
    var minCount = d3.min(data, function(d){ return d.Count});
    var maxCount = d3.max(data, function(d){ return d.Count});
    var colorScale = d3.scale.linear()
        .domain([minCount, maxCount])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb('#ECFF00'), d3.rgb('#005248')]);
    
    var xScale = d3.scale.ordinal()
        .domain(spellTypes)
        .rangePoints([heatmapPad.left, 
            heatmapSize.w - heatmapPad.right - boxsize])

    var yScale = d3.scale.ordinal()
        .domain(books)
        .rangePoints([heatmapPad.top,
            heatmapSize.h - heatmapPad.bottom - boxsize
            ])

    d3.select('#heatmap svg').remove();

    var heatmap = d3.select('#heatmap')
        .append('svg')
        .attr('width', heatmapSize.w)
        .attr('height', heatmapSize.h);

    var g = heatmap.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .append('rect')
        .attr('x', function(d) {return xScale(d.SpellType)})
        .attr('y', function(d) {return yScale(d.Book)})
        .attr('width', heatmapSize.boxsize-2)
        .attr('height', heatmapSize.boxsize-2)
        .attr('rx', 5)
        .attr('ry', 5)
        .style('fill', function(d){ return colorScale(d.Count)});

    var txt = heatmap.selectAll('text');
    txt.data(books)
        .enter()
        .append('text')
        .attr('x', heatmapPad.left - 5)
        .attr('y', function(d) {return (yScale(d) + boxsize / 2);})
        .attr('text-anchor', 'end')
        .text(function(d){return d});

    txt.data(spellTypes)
        .enter()
        .append('text')
        .attr('x', -(heatmapSize.h - heatmapPad.bottom))
        .attr('y', function(d) {return (xScale(d) + boxsize / 2);})
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text(function(d){return d});

    heatmap
        .append('text')
        .attr('x', heatmapPad.left - 5)
        .attr('y', heatmapPad.top - 5)
        .attr('class', 'text-bold')
        .attr('text-anchor', 'end')
        .text('Book');

    heatmap
        .append('text')
        .attr('x', -400)
        .attr('y', 145)
        .attr('class', 'text-bold')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text('Spell Type');


    var spellCountInterval = (maxCount-minCount)/8
    for(i=0; i<9; i++){
        heatmap
            .append('rect')
            .attr('width', '25')
            .attr('height', '35')
            .attr('x', heatmapSize.w - heatmapPad.right + 25)
            .attr('y', heatmapPad.top + (i * 35))
            .attr('fill', colorScale(minCount + (i * spellCountInterval)));
        heatmap
            .append('text')
            .attr('x', heatmapSize.w - heatmapPad.right + 55)
            .attr('y', heatmapPad.top + (i * 35)+20)
            .attr('text-anchor', 'start')
            .text(
                (minCount + (i * spellCountInterval)).toFixed(0)
                );
    }

    heatmap
        .append('text')
        .attr('x', heatmapSize.w - heatmapPad.right + 25)
        .attr('y', heatmapPad.top - 5)
        .attr('class', 'text-bold')
        .attr('text-anchor', 'start')
        .text('No. of Spells');

}

init();