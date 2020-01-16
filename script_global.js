const path = d3.geoPath();
const projection = d3.geoMercator()
    .scale(70)
    .translate([500/2, 500/2])

path.projection(projection);

var btn_width = (400-8)/4;
var btn_height = 15;

const svg_map = d3.select('#div_global').append("svg")
    .attr("id", "svg3")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr(
        'viewBox',
        '0 0 500 350'
    )

var svg_btn = d3.select("#div_global_button").append("svg")
    .attr("id", "svg3")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr(
        'viewBox',
        '0 0 400 100'
    );

var titles = ["Total energy production per inhabitant",
    "Total domestic energy consumption per inhabitant",
    "Oil products domestic consumption per inhabitant",
    "Natural gas domestic consumption per inhabitant",
    "Electricity domestic consumption per inhabitant",
    "Share of renewables in electricity production",
    "Share of wind and solar in electricity production",
    "CO2 emissions from fuel combustion per inhabitant"]

var units = ["(Tons of oil equivalent)",
            "(Ton of oil equivalent)",
            "(Tons)",
            "(1000 cm3)",
            "(kWh)",
            "(%)",
            "(%)",
            "(Tons of CO2 equivalent)"]

// Tooltip sur la map
var tool = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');

// Tooltip sur les btns
var selector = svg_btn
    .append("rect")
    .attr('width',btn_width)
    .attr("height", 2)
    .attr("fill", "#43a10f")
    .attr("opacity", "0");



d3.csv("Data/enerdata.csv").then(function(data){
    d3.json('Data/countries.geo.json').then(function(geojson) {
        // Link Datas to geoJSON
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < geojson.features.length; j++) {
                if (data[i].country == geojson.features[j].properties.name) {
                    geojson.features[j].properties.values = Object.values(data[i]);
                }
            }
        }

        var carte = svg_map.append("g").selectAll("path")
            .data(geojson.features);

        var title = svg_map.append("text")
            .attr("x", 250)
            .attr("y", 10)
            .attr("text-anchor", "middle");

        var unit = svg_map.append("text")
            .attr("x", 250)
            .attr("y", 25)
            .attr("text-anchor", "middle");
        draw(1)


        function draw(index) {
            [max, min] = get_min_max(index, geojson.features)

            var colorScale = d3.scaleQuantize()
                .domain([ min, max ])
                .range(["#2166ac", "#4393c3", "#92c5de", "#d1e5f0", "#fddbc7", "#f4a582", "#d6604d", "#b2182b"]);

            carte.enter()
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

            title.text(titles[index-1]);
            unit.text(units[index-1]);

            update_legend(colorScale);

            selector.attr("opacity", "100%")
                .attr("x", function(d,i){ return get_x_btn(d, index-1)})
                .attr("y", function(d,i){ return get_y_btn(d,index-1) -2})

            svg_btn.append("g")
                .selectAll("rect")
                .data(titles)
                .enter()
                .append("rect")
                .attr("x", get_x_btn)
                .attr("y", get_y_btn)
                .attr("width", btn_width)
                .attr("height", btn_height)
                .attr("fill", function(d,i){
                    if (i == index-1){
                        return "#FFFFFF";
                    }
                    else{
                        return "#e3e6eb";
                    }
                })
                .attr("value", function (d,i) {return i})
                .on("mousemove", function(d, i){
                    d3.select(this).attr("fill", "#FFFFFF");
                })
                .on("mouseout", function(d,i){
                    d3.select(this).attr("fill", "#e3e6eb");
                })
                .on("click", function (d, i) {
                    draw(i+1);
                });

            svg_btn.append("g")
                .selectAll("text")
                .data(titles)
                .enter()
                .append("text")
                .text(function(d){ return d})
                .attr("x", function (d,i){ return get_x_btn(d,i) + btn_width/2})
                .attr("y", function (d,i){ return get_y_btn(d,i) + btn_height/2})
                .style("font-size",  "4px")
                .attr("text-anchor", "middle");
        }
    });
});

function get_x_btn(d, i){
    if (i<4){
        return i*(btn_width +  2) + 2;
    }
    else{
        return (i-4)*(btn_width +  2) + 2;
    }
}

function get_y_btn(d,i){
    if(i<4){
        return 5;
    }
    else{
        return 5+btn_height+2;
    }

}

function get_min_max(index, data){
    var max = d3.max(data, function (d) {
        if (d.properties.values) {
            return parseInt(d.properties.values[index]);
        }
    });
    var min = d3.min(data, function (d) {
        if (d.properties.values) {
            return parseInt(d.properties.values[index]);
        } else {
            return null;
        }
    });

    return [max, min];
}


function update_legend(colorScale){
    svg_map.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(400, 15)");

    var legend = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .scale(colorScale)
        .shapePadding(5)
        .shapeWidth(10)
        .shapeHeight(5)
        .labelOffset(12);

    svg_map.select(".legendQuant")
        .call(legend)
}