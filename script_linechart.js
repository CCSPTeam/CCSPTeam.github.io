var width_chart = 250;
var height_chart = 150;
var margin_chart = 40;

const svg_linechart = d3.select('#div_linechart').append("svg")
    .attr("id", "svg234")
    .attr('preserveAspectRatio', 'xMinYMin meet')
   .attr(
        'viewBox',
        '0 0 600 380'
    )

var g1 = svg_linechart.append("svg").append("g")
 .attr("id", function(d, i) { return"g1" })
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", parseInt(height_chart- margin_chart) );
var g2 =  svg_linechart.append("svg").append("g")
.attr("id", function(d, i) { return"g2" })
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", parseInt(height_chart- margin_chart) )
    .attr("transform", "translate(0, " +parseInt( height_chart + margin_chart)+ ")");
var g3 =  svg_linechart.append("svg").append("g")
.attr("id", function(d, i) { return"g3" })
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", parseInt(height_chart- margin_chart))
    .attr("transform", "translate(" + parseInt(width_chart +margin_chart)+ ", 0)");
var g4 =  svg_linechart.append("svg").append("g")
.attr("id", function(d, i) { return"g4" })
    .attr("width", width_chart - 2 * margin_chart)
    .attr("height", parseInt(height_chart- margin_chart))
    .attr("transform", "translate(" + parseInt(width_chart+margin_chart) + "," + parseInt(height_chart+margin_chart)+ ")");

var parseTime = d3.timeParse("%Y");

var x1 = d3.scaleTime().range([margin_chart, width_chart+margin_chart]),
    y1 = d3.scaleLinear().range([height_chart, 0])
    z = d3.scaleOrdinal(d3.schemeCategory10);

// D3 Line generator with curveBasis being the interpolator
var line1 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return x1(parseTime(d.date));
    })
    .y(function (d) {
        return y1(d.value);
    });
var x2 = d3.scaleTime().range([margin_chart, width_chart+margin_chart]),
    y2 = d3.scaleLinear().range([height_chart, 0])
    z = d3.scaleOrdinal(d3.schemeCategory10);

// D3 Line generator with curveBasis being the interpolator
var line2 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return x2(parseTime(d.date));
    })
    .y(function (d) {
        return y2(d.value);
    });
    var x3 = d3.scaleTime().range([margin_chart, width_chart+margin_chart]),
    y3 = d3.scaleLinear().range([height_chart, 0])
    z = d3.scaleOrdinal(d3.schemeCategory10);

// D3 Line generator with curveBasis being the interpolator
var line3 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return x3(parseTime(d.date));
    })
    .y(function (d) {
        return y3(d.value);
    });
     var x4 = d3.scaleTime().range([margin_chart, width_chart+margin_chart]),
    y4 = d3.scaleLinear().range([height_chart, 0])
    z = d3.scaleOrdinal(d3.schemeCategory10);

// D3 Line generator with curveBasis being the interpolator
var line4 = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return x4(parseTime(d.date));
    })
    .y(function (d) {
        return y4(d.value);
    });
d3.csv("Data/CO2_emission.csv").then(function (data) {
    lineChartcreate(data,g2,"CO2 Emission",x1,y1,line1)
});


d3.csv("Data/Electricity_production.csv").then(function (data) {
        lineChartcreate(data,g1,"Electricity Production",x2,y2,line2)
    });
d3.csv("Data/electricity_domestic_consumption.csv").then(function (data) {
        lineChartcreate(data,g3, "Electricity Consumption",x3,y3,line3)
    });
d3.csv("Data/share_renewable.csv").then(function (data) {
        lineChartcreate(data,g4, "Share of Renewable",x4,y4,line4)
    });
    
function lineChartcreate(data,g,name, x , y , line){
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
    
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height_chart + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(45)")
        .style("font-size", "8px");
    ;

    g.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + margin_chart + ",0)")
        .call(d3.axisLeft(y))
        .style('font-size', '8px')
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text(name);

    var city = g.selectAll(".city")
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
        })
                 
    
        
        var legend = g
      .data(cities)
      .enter()
      .append('g')
      .attr('class', 'legend');
      console.log(legend)
    legend.append('rect')
      .attr('x', width_chart - 80)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return z(d.id);//color(d.name);
      });

    legend.append('text')
      .attr('x', width_chart - 8)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {         
        return d.id;
      });


var mouseG = g.append("g")
      .attr("class", "mouse-over-effects"+g.attr("id")).attr("transform", "translate(" + margin_chart + ","+0+")");
    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line"+g.attr("id"))
      .style("stroke", "black")
      .style("stroke-width", "0.5px")
      .style("opacity", "0");
      
    var lines = document.getElementById(g.attr("id")).getElementsByClassName("line");//.getElementById(g.attr("id"))

    var mousePerLine = mouseG.selectAll('.mouse-per-line'+g.attr("id"))
      .data(cities)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line"+g.attr("id"));

    mousePerLine.append("circle")
      .attr("r", 3)
      .style("stroke", function(d) {
        return z(d.id);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

        mousePerLine.append("text")
            .style("font-size", "8px")

      .attr("transform", "translate(10,3)");
      
    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width_chart) // can't catch mouse events on a g element
      .attr('height', height_chart)
      .attr('fill', 'none')   
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.selectAll(".mouse-line"+g.attr("id"))
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line"+g.attr("id")+" circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line"+g.attr("id")+" text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.selectAll(".mouse-line"+g.attr("id"))
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line"+g.attr("id")+" circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line"+g.attr("id")+" text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.selectAll(".mouse-line"+g.attr("id"))
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height_chart;
            d += " " + mouse[0] + "," + 0;
            
            return d;
          });
            console.log(g.attr("id"))
        d3.selectAll(".mouse-per-line"+g.attr("id"))
        
          .attr("transform", function(d, i) {
            
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              
              pos = lines[i].getPointAtLength(target);
              
              if ((target === end || target === beginning) && pos.x-margin_chart !== mouse[0]) {
                  break;
              }
              if (pos.x-margin_chart > mouse[0])      end = target;
              else if (pos.x-margin_chart < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(0));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
      
     
}