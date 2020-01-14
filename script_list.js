

d3.json("data.json").then(data => {
    keys = d3.keys(data)
    for (var j = 0; j < keys.length; j++){
        printHistogram(data, keys[j])
    }
});

function printHistogram(data, deviceName){

    var textmargin = 250
    // svg
    var svg_histogram = d3.select("#div_list")
        .append("svg")
        .attr("id","svg_histogram")
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
            'viewBox',
            '0 0 500 175'
        )
        .append("g")
        .attr("transform", "translate(40,30)");

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
        .range([textmargin, width+textmargin]);

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

    var colorhist = d3.scaleQuantize().range(["1776b6", "ff7f00", "24a221", "d8241f", "9564bf"]);
    colorhist.domain([0,4])

    // Construire l'histogramme
    svg_histogram.selectAll("rect")
        .data(x_values)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return (width / x_values.length)/2 + i * (width / x_values.length) -10 + textmargin
        })
        .attr("y", function (d) {
            return height - (d * coef);
        })
        .attr("width", 20)
        .attr("height", function (d) {
            return d * coef;
        })
        .style("fill", function(d,i){return colorhist(i)})
        .on("mouseover", function (d, i) {
            d3.select(this).transition()
                .duration(100)
                .attr('stroke', '#000000')
                .style("stroke-width", "2px");
            svg_histogram.append("text")
                .text(round_to_precision(d, 1))
                .attr("id", "tooltipp")
                .attr("x", function (d) {
                    x_values = data[deviceName]["histogram"]["values"];
                    return (width / x_values.length)/2 + i * (width / x_values.length) -10 + textmargin


                })
                .attr("y", function () {
                    return height - (d * coef) - 2;
                })
                .style("font-size", "7px");
        })
        .on("mouseout", function (d, i) {
            d3.select(this).transition()
                .duration(100)
                .style("stroke-width", "0px");
            svg_histogram.selectAll("#tooltipp")
                .style("visibility", "hidden");
        });

    // Axe Y
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(y_labels, function (d) {
            return d;
        })]);

    svg_histogram.append("g")
        .style("font-size", "7px")
        .attr("transform", "translate(" + (textmargin) + ",0)")
        .call(d3.axisLeft(y));

    // Titre de l'axe Y
    svg_histogram.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + textmargin)
        .attr("x", 0 - (height / 2))
        .attr("dy", "40px")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .text(title_yAxis);

    // Titre de l'histogramme
    svg_histogram.append("text")
        .attr("x", (width / 2)+ textmargin)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(title);

    svg_histogram.append("text")
        .text(deviceName)
        .attr("x", textmargin/4)
        .attr("y", height/2);
}