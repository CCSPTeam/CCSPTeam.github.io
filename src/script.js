// Load file
// var svg = d3.xml('../SVGs/PoC.svg')
//   .then(data => {
//        d3.select('div.display').node().append(data.documentElement)
//        console.log(data);
//    })

var svg = d3.select("#svg-container");

d3.xml("../SVGs/PoC.svg")
    .then(data => {
        svg.node().append(data.documentElement)
        var test = svg.select("g#Bass")
            .on("mouseover", function () {
                console.log("toto");
            })
        console.log(test)
    });