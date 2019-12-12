// Load file
// var svg = d3.xml('../SVGs/PoC.svg')
//   .then(data => {
//        d3.select('div.display').node().append(data.documentElement)
//        console.log(data);
//    })

var parameters = {
    "margin": 30,
    "width-data": 850,
    "height-data": 850,
    "width-rect": 300,
    "height-rect": 425,
    "rect-color": "black",
    "rect-stroke": 4
};

// Holds svg children to display them side by side
var svg = d3.select("#dady-container");

// Holds the data SVG
var svg2 = d3.select("#svg-container").append("svg")
    .attr("width", parameters["width-data"])
    .attr("height", parameters["height-data"])
    .attr("transform", "translate("+ parameters["margin"]+ ",0)");

// Display tooltip on the right
var svg3 = d3.select("#svg-container").append("svg")
    .attr("width", parameters["width-rect"])
    .attr("height", parameters["height-rect"])
    .attr("transform", "translate("+parameters["margin"]+",0)");

// Draw borders for tooltip
var rectangle = svg3.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", parameters["width-rect"])
    .attr("height", parameters["height-rect"])
    .style("stroke", parameters["rect-color"])
    .style("fill", "none")
    .style("stroke-width", parameters["rect-stroke"]);

// Sample to create information (graph, etc) for objects
// Can be removed, used for test only
var rectangle2 = svg3.append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", parameters["width-rect"]-20)
    .attr("height", parameters["height-rect"]-20)
    .style("stroke", parameters["rect-color"])
    .style("fill", "none")
    .style("stroke-width", parameters["rect-stroke"])
    .style("visibility", "hidden");

// Display the house
d3.xml("../SVGs/PoC.svg")
    .then(data => {
        svg2.node().append(data.documentElement);

        // Add click event to objects
        // Has to generate information for objects
        var bass = svg2.select("g#Bass")
            .on("click", function () {

                // Visibility parameter allow to display or remove information on click
                if(rectangle2.style("visibility") == "hidden") {
                    return rectangle2.style("visibility", "visible");
                } else {
                    return rectangle2.style("visibility", "hidden");
                }

            });

        var washer = svg2.select("g#Washer")
            .on("click", function(){
                if(rectangle2.style("visibility") == "hidden") {
                    return rectangle2.style("visibility", "visible");
                } else {
                    return rectangle2.style("visibility", "hidden");
                }
            });
    });


