var width_chart = 250;
var height_chart = 150;
var margin_chart = 40;

const svg_linechart = d3.select('#div_linechart').append("svg")
    .attr("id", "svg234")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr(
        'viewBox',
        '0 0 500 300'
    )

var g1 = svg_linechart.append("g")
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", height_chart);
var g2 = svg_linechart.append("g")
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", height_chart)
    .attr("transform", "translate(0, " + height_chart + ")");
var g3 = svg_linechart.append("g")
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", height_chart)
    .attr("transform", "translate(" + width_chart + ", 0)");
var g4 = svg_linechart.append("g")
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", height_chart)
    .attr("transform", "translate(" + width_chart + "," + height_chart + ")");

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([margin_chart, width_chart+margin_chart]),
    y = d3.scaleLinear().range([height_chart, 0])
    z = d3.scaleOrdinal(d3.schemeCategory10);

// D3 Line generator with curveBasis being the interpolator
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return x(parseTime(d.date));
    })
    .y(function (d) {
        return y(d.value);
    });

d3.csv("Data/CO2_emission.csv").then(function (data) {
    var cities = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {date: d.date, value: parseInt(d[id])};
            })
        };
    });
    x.domain(d3.extent(data, function (d) {
        return parseTime(d.date);
    }));
    y.domain([
        d3.min(cities, function (c) {
            return d3.min(c.values, function (d) {
                return parseInt(d.value);
            });
        }),
        d3.max(cities, function (c) {
            return d3.max(c.values, function (d) {
                return parseInt(d.value);
            });
        })
    ]);

    g1.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height_chart + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(45)")
        .style("font-size", "8px");
    ;

    g1.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + margin_chart + ",0)")
        .call(d3.axisLeft(y))
        .style('font-size', '8px')
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("MTons of CO2 equivalent");

    var city = g1.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

    // Create a <path> element inside of each city <g>
    // Use line generator function to convert 366 data points into SVG path string
    city.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return z(d.id);
        })
        .style("stroke-width", function (d) {
            if (d.id=="World"){
                return "2px";
            }
            else{
                return '1px';
            }
        });
});