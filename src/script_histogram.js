// NOM_DE_L_APPAREIL : Dishwasher - Microwave - Coffee - hotplate - Bass
// A mettre en variable ? par une fonction ?

function updateHistogram(NOM_DE_L_APPAREIL){

// Dimension et marges
    var margin = {top: 50, right: 10, bottom: 50, left: 70},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// Création du svg
    var svg = d3.select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Div pour le tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    console.log("mdr1")

// Chargement JSON

    var url = "../Data/data.json";

    d3.json(url).then(function(data) {
        console.log("mdr2");
        // Récupération des données de l'histogramme
        title = data[NOM_DE_L_APPAREIL]["histogram"].title;
        title_yAxis = data[NOM_DE_L_APPAREIL]["histogram"]["y_label"];
        x_values = data[NOM_DE_L_APPAREIL]["histogram"]["values"];
        x_names = data[NOM_DE_L_APPAREIL]["histogram"]["x_labels"];
        y_unity = data[NOM_DE_L_APPAREIL]["usage"]["unit"];

        // Conversion (peut être inutile)
        for (var i = 0; i < x_values.length; i++) {
            x_values[i] = parseFloat(x_values[i])
        }

        // Axe X
        var x = d3.scaleLinear()
            .domain(x_names)
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

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

        // Construire l'histogramme
        svg.selectAll("rect")
            .data(x_values)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return 10 + i * (width / x_values.length);
            })
            .attr("y", function (d) {
                return height - (d * coef);
            })
            .attr("width", 40)
            .attr("height", function (d) {
                return d * coef;
            })
            .style("fill", "#1996FF")
            .on("mouseover", function (d) {
                d3.select(this).transition()
                    .duration(500)
                    .style("fill", "#1480DA");
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("" + d + " " + y_unity)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this).transition()
                    .duration(500)
                    .style("fill", "#1996FF");
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Ajouter les x_names
        svg.selectAll("text")
            .data(x_names)
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return 10 + i * (width / x_values.length);
            })
            .attr("y", function (d) {
                return height + 20;
            });

        // Axe Y
        var y = d3.scaleLinear()
            .range([height, 0]);
        y.domain([0, d3.max(y_labels, function (d) {
            return d;
        })]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Titre de l'axe Y
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(title_yAxis);

        // Titre de l'histogramme
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text(title);

    });

    console.log("mdr3")
}