// Load file
// var svg = d3.xml('../SVGs/PoC.svg')
//   .then(data => {
//        d3.select('div.display').node().append(data.documentElement)
//        console.log(data);
//    })

var parameters = {
    "margin": 0,
    "width-data": 600,
    "height-data": 600,
    "width-data": screen.width*0.45,
    "height-data": screen.height*0.45,
    "width-rect": 300,
    "height-rect": 425,
    "rect-color": "black",
    "rect-stroke": 1
};

function round_to_precision(x, precision) {
    var coef_precision = 10 * precision;
    return Math.round(x * coef_precision) / coef_precision;
}

// Holds svg children to display them side by side
var svg = d3.select("#dady-container");

// Holds the data SVG
var svg2 = d3.select("#svg-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1102 551")
   // .attr("width", parameters["width-data"])
   // .attr("height", parameters["height-data"])
    .attr("transform", "translate(" + parameters["margin"] + ",0)");

let idSelected;
let previd;
let powerInput = d3.select("#power");
let useDD = d3.select("#useDD");
let unit = d3.select("#unit");
let cost = d3.select("#cost");

var tooltip = svg2.append('circle')
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .style("visibility", 'hidden')
    .style("stroke", "black")

// Display the house
d3.xml("PoC.svg")
    .then(housesvg => {
        svg2.node().append(housesvg.documentElement);

        d3.json("data.json").then(data => {

            var element = svg2.selectAll(".clickable")
                .on('click', (d, i, e) => {
                    idSelected = e[i].id;
                    if(idSelected.includes("Lamp")){
                        idSelected="Light"
                    }
                    // Visibility parameter allow to display or remove information on click
                    div_customContent = d3.select("#div_customContent");
                    if (div_customContent.style("visibility") === "hidden") {
                        div_customContent.style("visibility", "visible");
                    } else if(idprev === idSelected) {
                        div_customContent.style("visibility", "hidden");
                    }
                    idprev=idSelected
                    
                    let title = d3.select("#title");
                    myObjElec = data[idSelected];
                    unitElec = myObjElec.usage.unit;
                    powerElec = myObjElec.power;
                    nbUseElec = myObjElec.usage.value;
                    costElec = 0;
                    title.property('innerHTML', idSelected);// Je sais pas pourquoi cette ligne plante tout !
                    powerInput.property('value', powerElec);
                    unit.property('innerHTML', unitElec);
                    useDD.property('value', nbUseElec);
                    cost.property('innerHTML', round_to_precision(nbUseElec * myObjElec.usage.coef * powerElec, 2));

                    //Mise à jour de l'histogramme
                    updateHistogram(data, idSelected);

                })
              .on("mouseover",function(d,e,i){
                    var mousePosition = d3.mouse(this);
                    d3.select("#"+i[e].id).selectAll("rect,path,circle ").style("stroke", "rgba(240, 52, 52, 1)").style("stroke-width", "5");
                    /*tooltip.style("visibility", 'visible')
                        .attr("cx", d3.event.pageX-60)
                        .attr("cy", d3.event.layerY)
                        .raise();*/
                })
                .on('mouseout', function(d,e,i){

                   d3.select("#"+i[e].id).selectAll("rect,path,circle").style("stroke", "None");
                });


            function onChangeCost() {
                if (idSelected !== null) {
                    myObjElec = data[idSelected];

                    powerElec = powerInput.property("value");
                    nbUseElec = useDD.property("value");
                    costElec = 0;
                    costElec = nbUseElec * myObjElec.usage.coef * powerElec;
                    cost.property('innerHTML', round_to_precision(costElec, 2));
                }
            }

            powerInput.on('change', onChangeCost)
            useDD.on('change', onChangeCost)

        });
    })

    

