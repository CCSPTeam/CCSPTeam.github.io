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

var titles = ["Total energy production (Mtoe)",
    "Total energy consumption (Mtoe)",
    "Oil products domestic consumption (Mt)",
    "Natural gas domestic consumption (bcm)",
    "Electricity domestic consumption (TWh)",
    "Share of renewables in electricity production (%)",
    "Share of wind and solar in electricity production  (%)",
    "CO2 emissions from fuel combustion (MtCO2)"]

var tool = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');

var selected = 0;

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

        var svg_btn = d3.select("#div_global_button").append("svg")
            .attr("id", "svg3")
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr(
                'viewBox',
                '0 0 400 100'
            );


        draw(1)


        function draw(index) {
            var max = d3.max(geojson.features, function (d) {
                if (d.properties.values) {
                    return parseInt(d.properties.values[index]);
                }
            });
            var min = d3.min(geojson.features, function (d) {
                if (d.properties.values) {
                    return parseInt(d.properties.values[index]);
                } else {
                    return null;
                }
            });

            var colorScale = d3.scaleQuantize()
                .domain([ min, max ])
                .range(["#2166ac", "#4393c3", "#92c5de", "#d1e5f0", "#fddbc7", "#f4a582", "#d6604d", "#b2182b"]);


            console.log(d3.schemeRdBu[9])

            console.log(parseInt(max), min)
            deps.selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    if (d.properties.values) {
                        return colorScale(parseInt(d.properties.values[index]));
                    } else {
                        return "#ccc";
                    }
                })
                .on('mousemove', function(d) {
                    var mousePosition = d3.mouse(this);
                    if (d.properties.values){
                        tool.classed('hidden', false)
                            .attr('style', 'left:' + (event.pageX + 10) +
                                'px; top:' + (event.pageY + 10) + 'px')
                            .html(d.properties.name + ": " + 	d.properties.values[index]);}
                })
                .on('mouseout', function() {
                    tool.classed('hidden', true);
                });
            svg4.append("text")
                .text(titles[index-1])
                .attr("x", 250)
                .attr("y", 10)
                .attr("text-anchor", "middle");


            svg4.append("g")
                .attr("class", "legendQuant")
                .attr("transform", "translate(400, 10)");



            var legend = d3.legendColor()
                .labelFormat(d3.format(".0f"))
                .scale(colorScale)
                .shapePadding(5)
                .shapeWidth(10)
                .shapeHeight(5)
                .labelOffset(12);

            svg4.select(".legendQuant")
                .call(legend)

            svg_btn.append("g")
                .selectAll("rect")
                .data(titles)
                .enter()
                .append("rect")
                .attr("x", function(d,i){
                    if (i<4){
                        return i*((400-40)/4 +  10) + 5;
                    }
                    else{
                        return (i-4)*((400-40)/4 +  10) + 5;
                    }
                })
                .attr("y", function (d, i) {
                    if(i<4){
                        return 5;
                    }
                    else{
                        return 40;
                    }

                })
                .attr("width", (400-40)/4)
                .attr("height", 25)
                .attr("fill", function(d,i){
                    if (i == index-1){
                        return "#888888";
                    }
                    else{
                        return "#FFFFFF";
                    }
                })
                .attr("stroke", "#000000")
                .attr("stroke-width", "0.5")
                .attr("value", function (d,i) {return i})
                .on("mouseover", function(d, i){
                    d3.select(this).attr("stroke-width", "2");
                })
                .on("mouseout", function(d,i){
                    d3.select(this).attr("stroke-width", "0.5");
                })
                .on("click", function (d, i) {
                    draw(i+1);
                });

            svg_btn.append("g")
                .selectAll("text")
                .data(titles)
                .enter()
                .append("text")
                .text(function(d){ console.log(d); return d})
                .attr("x", function(d,i){
                    if (i<4){
                        return i*((400-40)/4 +  10) + 50;
                    }
                    else{
                        return (i-4)*((400-40)/4 +  10) + 50;
                    }
                } )
                .attr("y", function (d, i) {
                    if(i<4){
                        return 20;
                    }
                    else{
                        return 55;
                    }

                })
                .style("font-size",  "4px")
                .attr("text-anchor", "middle");
        }
    });
});



