// deviceName : Dishwasher - Microwave - Coffee - hotplate - Bass
// A mettre en variable ? par une fonction ?

// Dimension et marges
var margin = {top: 20, right: 10, bottom: 50, left: 70},
    width = 125 ,
    height = 75 ;


var cpt = 0;

function updateHistogram(data, deviceName){

    //Gestion dynamique des histogrammes
    cpt = cpt + 1;
    if (cpt > 1) {
        d3.select("#svg_histogram").remove();
    }

    // svg
    var svg_histogram = d3.select("#histogram")
        .append("svg")
        .attr("id","svg_histogram")
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
            'viewBox',
            '0 0 ' +
            (width + margin.left + margin.right) +
            ' ' +
            (height + margin.top + margin.bottom)
        )
        .append("g")
        .attr("transform", "translate(40,30)");
    

    // Chargement JSON
    // Récupération des données de l'histogramme
    title = data[deviceName]["histogram"].title;
    title_yAxis = data[deviceName]["histogram"]["y_label"];
    x_values = data[deviceName]["histogram"]["values"];
    x_names = data[deviceName]["histogram"]["x_labels"];

    // Conversion (peut être inutile)
    for (var i = 0; i < x_values.length; i++) {
        x_values[i] = parseFloat(x_values[i])
    }

    // Axe X
    var x = d3.scaleBand().domain(x_names.map(function (el) {
        return el}))
        .range([0, width]);

    svg_histogram.append("g")
        .style("font-size", "7px")
        .attr("transform", "translate(0," + height+ ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)")

    // Trouver le coeficient
    var max = x_values.reduce(function (a, b) {
        return Math.max(a, b);
    })
    var coef = (height / max);

    // Construire les y labels (l'échelle)
    var y_labels = []
    for (var i = 0; i <= 10; i++) {
        y_labels.push(i * (max / 10));
    }

    var color = d3.scaleQuantize().range(["1776b6", "ff7f00", "24a221", "d8241f", "9564bf"]);
    color.domain([0,4])

    // Construire l'histogramme
    svg_histogram.selectAll("rect")
        .data(x_values)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return (width / x_values.length)/2 + i * (width / x_values.length) -10;
        })
        .attr("y", function (d) {
            return height - (d * coef);
        })
        .attr("width", 20)
        .attr("height", function (d) {
            return d * coef;
        })
        .style("fill", function(d,i){return color(i)})
        .on("mouseover", function (d) {
            d3.select(this).transition()
                .duration(500)
                .style("fill", "#1480DA");
        })
        .on("mouseout", function (d) {
            d3.select(this).transition()
                .duration(500)
                .style("fill", "#1996FF");
        });

    // Axe Y
    var y = d3.scaleLinear()
        .range([height, 0]);
    y.domain([0, d3.max(y_labels, function (d) {
        return d;
    })]);
    svg_histogram.append("g")
        .style("font-size", "7px")
        .call(d3.axisLeft(y));

    // Titre de l'axe Y
    svg_histogram.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "40px")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .text(title_yAxis);

    // Titre de l'histogramme
    svg_histogram.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(title);
}