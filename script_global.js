const path = d3.geoPath();
const projection = d3.geoMercator()
    .scale(70)
    .translate([500/2, 500/2])

path.projection(projection);

const svg4 = d3.select('#div_global').append("svg")
    .attr("id", "svg3")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr(
        'viewBox',
        '0 0 500 350'
    )

//var color = d3.scaleQuantize()
    //.range(["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"]);
var color = d3.scaleOrdinal(d3.schemeReds[5]);


var titles = ["Total energy production (Mtoe)",
    "Total energy consumption (Mtoe)",
    "Oil products domestic consumption (Mt)",
    "Natural gas domestic consumption (bcm)",
    "Coal and lignite domestic consumption (Mt)",
    "Electricity domestic consumption (TWh)",
    "Share of renewables in electricity production (%)",
    "Share of wind and solar in electricity production  (%)",
    "CO2 emissions from fuel combustion (MtCO2)"]


const deps = svg4.append("g");
d3.csv("Data/enerdata.csv").then(function(data){
    d3.json('Data/countries.geo.json').then(function(geojson) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < geojson.features.length; j++) {
                if (data[i].country == geojson.features[j].properties.name) {
                    geojson.features[j].properties.values = Object.values(data[i]);
                    cpt = cpt +1;
                }
            }
        }
        draw(2)

        function draw(index) {
            var max = d3.max(geojson.features, function (d) {
                if (d.properties.values) {
                    return d.properties.values[index];
                } else {
                    return null;
                }
            });
            var min = d3.min(geojson.features, function (d) {
                if (d.properties.values) {
                    return d.properties.values[index];
                } else {
                    return null;
                }
            });

            color.domain([min, max])
            deps.selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    if (d.properties.values) {
                        return color(d.properties.values[index]);
                    } else {
                        return "#ccc";
                    }
                });
            svg4.append("text")
                .text(titles[index-1])
                .attr("x", 250)
                .attr("y", 10)
                .attr("text-anchor", "middle");


            svg4.append("g")
                .attr("class", "legendQuant")
                .attr("transform", "translate(400, 10)");

            var colorScale = d3.scaleQuantize()
                .domain([ min, max ])
                .range(d3.schemeReds[5]);

            var legend = d3.legendColor()
                .labelFormat(d3.format(".0f"))
                .scale(colorScale)
                .shapePadding(5)
                .shapeWidth(10)
                .shapeHeight(5)
                .labelOffset(12);

            svg4.select(".legendQuant")
                .call(legend)
        }
    });
});



