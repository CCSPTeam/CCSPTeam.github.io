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
    "rect-stroke": 1
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
    .attr("height", parameters["height-rect"]-25)
    .attr("transform", "translate(0,25)")
    .style("stroke", parameters["rect-color"])
    .style("fill", "none")
    .style("stroke-width", parameters["rect-stroke"]);

// Sample to create information (graph, etc) for objects
// Can be removed, used for test only
var rectangle2 = svg3.append("rect")
    .attr("x", 10)
    .attr("y", 45)
    .attr("width", parameters["width-rect"]-20)
    .attr("height", parameters["height-rect"]-45)
    .style("stroke", parameters["rect-color"])
    .style("fill", "none")
    .style("stroke-width", parameters["rect-stroke"])
    .style("visibility", "hidden");


// var graph = svg3.append("chart")
//     .attr("id", "svg3")
//     .attr("width", parameters["width-rect"] - 20)
//     .attr("height", parameters["height-rect"]-45)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var histo = function(id){
//     d3.json('data.json', function (data) {
//         var x = d3.scaleBand()
//             .range([0, parameters["width-rect"] - 20])
//             .padding(0.1);
//
//         var y = d3.scaleLinear()
//             .range([height, 0]);
//     });
// }

var objectText = svg3.append("text")
    .attr("x", 150-25)
    .attr("y", 20)
    .text("")

// Display the house
d3.xml("../SVGs/PoC.svg")
    .then(data => {
        svg2.node().append(data.documentElement);
        var element = svg2.selectAll(".clickable")
            .on('click', (d, i, e) => {
                console.log(e[i].id)
                // Visibility parameter allow to display or remove information on click
                // myDiv = d3.select("#div_customContent");
                // console.log(myDiv)
                if (rectangle2.style("visibility") == "hidden") {
                    objectText.text(e[i].id)
                    return rectangle2.style("visibility", "visible");
                } else {
                    objectText.text("")
                    return rectangle2.style("visibility", "hidden");
                }

            });

    });