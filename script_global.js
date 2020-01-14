const path = d3.geoPath();
const projection = d3.geoMercator()
    .scale(70)
    .translate([500/2, 500/2.5])

path.projection(projection);

const svg4 = d3.select('#div_global').append("svg")
    .attr("id", "svg3")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr(
        'viewBox',
        '0 0 500 300'
    )

var color = d3.scaleQuantize()
    .range(["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"]);

const deps = svg4.append("g");
d3.csv("Data/enerdata.csv").then(function(data){
    d3.json('Data/countries.geo.json').then(function(geojson) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < geojson.features.length; j++) {
                if (data[i].country == geojson.features[j].properties.name) {
                    geojson.features[j].properties.values = Object.values(data[i]);
                    cpt = cpt +1;
                    console.log(geojson.features[j].properties.values)
                }
            }
        }
        console.log(cpt);
        console.log(d3.max(geojson.features, function(d) {
            console.log(d);
            return d.properties.values[0]}))
        deps.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path);
    });
});
