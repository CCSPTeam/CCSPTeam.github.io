// Load file
// var svg = d3.xml('../SVGs/PoC.svg')
//   .then(data => {
//        d3.select('div.display').node().append(data.documentElement)
//        console.log(data);
//    })

var parameters = {
    "margin": 30,
    "width-data": 850,
    "height-data": 450,
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
let  idSelected;
// Display tooltip on the right
/*var svg3 = d3.select("#svg-container").append("svg")
    .attr("width", parameters["width-rect"])
    .attr("height", parameters["height-rect"])
    .attr("transform", "translate("+parameters["margin"]+",0)");

// Draw borders for tooltip
/*var rectangle = svg3.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", parameters["width-rect"])
    .attr("height", parameters["height-rect"]-25)
    .attr("transform", "translate(0,25)")
    .style("stroke", parameters["rect-color"])
    .style("fill", "none")
    .style("stroke-width", parameters["rect-stroke"]);

// Sample to create information (graph, etc) for objects*/
// Can be removed, used for test only
/*var rectangle2 = svg3.append("rect")
    .attr("x", 10)
    .attr("y", 45)
    .attr("width", parameters["width-rect"]-20)
    .attr("height", parameters["height-rect"]-45)
    .style("stroke", parameters["rect-color"])
    .style("fill", "none")
    .style("stroke-width", parameters["rect-stroke"])
    .style("visibility", "hidden");

var objectText = svg3.append("text")
    .attr("x", 150-25)
    .attr("y", 20)
    .text("")*/

    let powerInput=d3.select("#power");
    let useDD=d3.select("#useDD");
    let unit=d3.select("#unit");
    let title=d3.select("#title");
    let cost=d3.select("#cost");    
   
// Display the house
d3.xml("../SVGs/PoC.svg")
    .then(housesvg => {
        svg2.node().append(housesvg.documentElement);

       d3.json("../Data/data.json").then( data => {
          
        var element = svg2.selectAll(".clickable")
            .on('click', (d, i,e) => {



                idSelected=e[i].id;
                // Visibility parameter allow to display or remove information on click
                div_customContent=d3.select("#div_customContent");
                if(div_customContent.style("visibility") == "hidden") {
                   
                     div_customContent.style("visibility", "visible");
                } else {
                     div_customContent.style("visibility", "hidden");
                }
                myObjElec=data[idSelected];
                unitElec=myObjElec.usage.unit;
                powerElec=myObjElec.power;
                nbUseElec=myObjElec.usage.value;
                costElec=0;
                title.property('innerHTML',idSelected );
                powerInput.property('value',powerElec );
                unit.property('innerHTML',unitElec );
                useDD.property('value', nbUseElec);
                  
                
                cost.property('innerHTML',nbUseElec*myObjElec.usage.coef*powerElec );

                //Mise à jour de l'histogramme
                updateHistogram(idSelected);

            });

        function onChangeCost(){
            if(idSelected!==null){
             myObjElec=data[idSelected];
                
                powerElec=powerInput.property("value");
                nbUseElec=useDD.property("value");
                costElec=0;
                costElec=nbUseElec*myObjElec.usage.coef*powerElec;

                  cost.property('innerHTML',costElec );
            }
        }
         powerInput.on('change',onChangeCost)
        useDD.on('change',onChangeCost)
      
        });
    })

    