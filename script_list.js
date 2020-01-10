var svg_list = d3.select("#div_list")
    .append("svg")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr("width", 100)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(40,30)");

console.log(svg_list)

svg_list.selectAll("g")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", "#154352");

