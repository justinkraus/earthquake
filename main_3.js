//Create SVG element

var margin = {top: 60, right: 20, bottom: 50, left: 70},
 width = 650 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

var svg = d3.select("div#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgDefs = svg.append('defs');

// 5 add tooltip div (also in css)
  var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

var mainGradient = svgDefs.append('linearGradient')
    .attr('id', 'mainGradient')
    .attr('gradientTransform', 'rotate(90)');

// Create the stops of the main gradient. Each stop will be assigned
// a class to style the stop using CSS.


mainGradient.append('stop')
    .attr('class', 'stop-2')
    .attr('offset', '0%');

mainGradient.append('stop')
    .attr('class', 'stop-3')
    .attr('offset', '20%');

mainGradient.append('stop')
    .attr('class', 'stop-4')
    .attr('offset', '40%');

mainGradient.append('stop')
    .attr('class', 'stop-5')
    .attr('offset', '60%');

mainGradient.append('stop')
    .attr('class', 'stop-6')
    .attr('offset', '80%');

mainGradient.append('stop')
    .attr('class', 'stop-7')
    .attr('offset', '100%');

// mainGradient.append('stop')
//     .attr('class', 'stop-8')
//     .attr('offset', '100%');

// Use the gradient to set the shape fill, via CSS.
svg.append('rect')
    .classed('filled', true)
    .attr('width', width)
    .attr('height', height);


d3.csv("d3_quake_scatter_us_1.csv", function(data) {

var xAxisLabels = ['us']
var yAxisLabels = [0, 700]
var jitterWidth = (width/2) - 5


var y = d3.scaleLinear()
  .domain(yAxisLabels)          // Note that here the Y scale is set manually
  .range([0, height])
svg.append("g").call( d3.axisLeft(y) )


var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(xAxisLabels)
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append("g")
    .attr("transform", "translate(0)")
    // .call(d3.axisTop(x))

var histogram = d3.histogram()
      .domain(y.domain())
      .thresholds(y.ticks(90))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value(d => d)

var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
  .key(function(d) { return d.location;})
  .rollup(function(d) {   // For each key..
    input = d.map(function(g) { return g.depth;})    // Keep the variable called Sepal_Length
    bins = histogram(input)   // And compute the binning on it.
    return(bins)
  })
  .entries(data)

// What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
var maxNum = 0
for ( i in sumstat ){
  allBins = sumstat[i].value
  lengths = allBins.map(function(a){return a.length;})
  longuest = d3.max(lengths)
  if (longuest > maxNum) { maxNum = longuest }
}

// The maximum width of a violin must be x.bandwidth = the width dedicated to a group
var xNum = d3.scaleLinear()
  .range([0, x.bandwidth()])
  .domain([-maxNum,maxNum])

var myColor = d3.scaleLinear()
    .domain([-1.34, 6.9])
    .range(["blue", "red"]);

var radiusScale = d3.scaleSqrt().domain([6309570000000, 5011870000000000000]).range([3, 30])

svg
  .selectAll("myViolin")
  .data(sumstat)
  .enter()        // So now we are working group per group
  .append("g")
    .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
  .append("path")
      .datum(function(d){ return(d.value)})     // So now we are working bin per bin
      .style("stroke", "none")
      .style("fill","silver")
      .attr("d", d3.area()
          .x0( xNum(0) )
          .x1(function(d){ return(xNum(d.length)) } )
          .y(function(d){ return(y(d.x0)) } )
          .curve(d3.curveBasis)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
      )


svg
  .selectAll("indPoints")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d){return(x(d.location) + x.bandwidth()/2 - Math.random()*jitterWidth )})
    .attr("cy", function(d){return(y(d.depth))})
    .attr("r", function(d){
        return radiusScale(d.energy)
      })
    .style("fill", function(d){ return(myColor(d.mag))})
    .attr("stroke", "grey")
    .style("opacity", .8)
    .on("mouseover", function(d) {    
            div.transition()
              .duration(200)          
                .style("opacity", .9);
    //         div.transition()
        // .duration(200) 
        // .style("opacity", .9);
            div .html(d.mag + " Magnitude " +
                "<br />" + d.place + 
                "<br />" + d.date +
                "<br />" + d.time)
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            // div  .html(d.Name_Display <br /> "-" + d.Sub_Category)
                // .style("left", (parseInt(d3.select(this).attr("cx")) + document.getElementById("body").offsetLeft) + "px") 
                // .style("top", (parseInt(d3.select(this).attr("cy")) + document.getElementById("body").offsetTop) + "px");    
                // .style("left", (d3.event.pageX) + "px")    
                // .style("top", (d3.event.pageY - 28) + "px"); 
            })          
          .on("mouseout", function(d) {    
            div.transition()     
                .style("opacity", 0);  
          })

  // text label for the x axis
svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         -40 + ")")
    .style("text-anchor", "middle")
    .text("Seismic Activity Dectected by the United States National Seismic Network")
    .style("fill", "slategrey");

  // text label for the x axis line 2
svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         -25 + ")")
    .style("text-anchor", "middle")
    .text("September 6th - October 6th, 2020")
    .style("fill", "slategrey");

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Kilometers Below Earth's Surface")
      .style("fill", "slategrey");   


//Gradient start
// Create the svg:defs element and the main gradient definition.


// Use the gradient to set the shape stroke, via CSS.
// svg.append('rect')
//     .classed('outlined', true)
//     .attr('x', w / 2 + padding / 2)
//     .attr('y', padding)
//     .attr('width', (w / 2) - 1.5 * padding)
//     .attr('height', h - 2 * padding);
// //gradient end




// function ready (error, datapoints) {



// svg.selectAll("circle")
//    .data(datapoints)
//    .enter()
//    .append("circle")
//    .attr("class", "quake")
//    .attr("r", function(d){
//         return radiusScale(d.energy)
//       })
//    .attr("fill", d=>circlecolor(d.mag))
//    .attr("cx", function(d){ // working with no jitter
//     return (xScaleLabels(d.location) + (Math.random()*jitterWidth));
//    })
//    // .attr("cx", function(d){ // working but not aligned
//    //  return (xScaleLabels(d.location) + (Math.random()*jitterWidth)) - ((margin.right - margin.left)/2);
//    // })
//    .attr("cy", function(d) { 
//         return (d.depth);
//    })

// // ((margin.right - margin.left)/2)

//  };
});