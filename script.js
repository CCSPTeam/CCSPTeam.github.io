// Load file
// var svg = d3.xml('../SVGs/PoC.svg')
//   .then(data => {
//        d3.select('div.display').node().append(data.documentElement)
//        console.log(data);
//    })
console.log(screen.width, screen.height)
var parameters = {
    "margin": 30,
    "width-data": screen.width*0.4,
    "height-data": screen.height*0.4,
    "width-rect": 300,
    "height-rect": 425,
    "rect-color": "black",
    "rect-stroke": 1
};

// Holds svg children to display them side by side
var svg = d3.select("#dady-container");

// Holds the data SVG
var svg2 = d3.select("#svg-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 500 500")
    .classed("svg-content", true);
    // .attr("width", parameters["width-data"])
    // .attr("height", parameters["height-data"])
    //.attr("transform", "translate(" + parameters["margin"] + ",0)");

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
                    cost.property('innerHTML', nbUseElec * myObjElec.usage.coef * powerElec);

                    //Mise à jour de l'histogramme
                    updateHistogram(data, idSelected);

                })
                .on("mouseover",function(d){
                    var mousePosition = d3.mouse(this);
                    tooltip.style("visibility", 'visible')
                        .attr("cx", d3.event.pageX)
                        .attr("cy", d3.event.pageY)
                        .raise();
                })
                .on('mouseout', function(d){

                    tooltip.style("visibility", 'hidden')
                });

            function onChangeCost() {
                if (idSelected !== null) {
                    myObjElec = data[idSelected];

                    powerElec = powerInput.property("value");
                    nbUseElec = useDD.property("value");
                    costElec = 0;
                    costElec = nbUseElec * myObjElec.usage.coef * powerElec;

                    cost.property('innerHTML', costElec);
                }
            }

            powerInput.on('change', onChangeCost)
            useDD.on('change', onChangeCost)

        });
    })

    

