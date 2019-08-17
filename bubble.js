// set width and heigh for svg
var width = 1100;
var height = 800;
var svg = null;

// set for bubbles and nodes(circles)
var bubbles = null;




// read the json file
 
d3.json("top_movies_updated.json", function(error, data){
    console.log(data);
     var actors = []
     var movies = []
     data.forEach(function(d){
         for (var i = 0; i<d.Cast_list.length; i++) {
             actors.push(d.Cast_list[i])
             movies.push(d.Title)
         }  
     })
    
    // create an object with actor as key and movie(s) the actor in as value
    // create an array for actor list 

     var actorMovies = new Object()
     var actorList = []
     for (var j = 0; j<actors.length; j++){
         if (actorList.indexOf(actors[j]) == -1) {
            actorMovies[actors[j]] = [];
            actorMovies[actors[j]].push(movies[j]);
            actorList.push(actors[j])    
         }
         else {
            actorMovies[actors[j]].push(movies[j])  
            // console.log(actors[j]) 
         };
         
     }
    
    //create another actor:movie pair Object  with more than 3 movies on the list
    var actorThreeMovies = []
    actorList.forEach(function(actor){
        if (actorMovies[actor].length >= 3){
            aM = {}
            aM.actor = actor
            aM.movies = actorMovies[actor]
            aM.movieNum = actorMovies[actor].length
            actorThreeMovies.push(aM)

        }
    })
     
    // console.log(actorThreeMovies)

    // create svg

   var svg = d3.select("#vis").append("svg")
     .attr("width", width)
     .attr("height", height)
     .append("g")
     .attr("transform", "translate(0,0)")


    // set tooltip
    var tooltip = floatingTooltip('gates_tooltip', 240);
    
    // scale the radius for bubbles
    var maxAmount = d3.max(actorThreeMovies, function(d){return +d.movieNum})

    var radiusScale = d3.scalePow()
           .exponent(1.5)
           .domain([3, maxAmount])
           .range([20, 90])
    
    // function for grouping 
    function colorGroup(m){
        if (m ==3){
            return 'g1';
        }
        if (m==4) {
            return 'g2';
        }
        if (m ==5){
            return 'g3';
        }
        if (m==6) {
            return 'g4';
        }
        if (m>=7) {
            return 'g5';
        }
    }
     
    // nodes for bubbles
    var nodes = actorThreeMovies.map(function(d){
            return {
                actor: d.actor,
                movies: d.movies, 
                radius: radiusScale(+d.movieNum),
                value: +d.movieNum,
                group : colorGroup(+d.movieNum),
                x: Math.random()*900,
                y: Math.random()*800
            };
     });
    
    nodes.sort(function(a, b){return b.value - a.value});

    console.log(nodes)

    // tooltips
    var tooltip = d3.select("#vis")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
    

   
    //color for bubbles
    var fillcolor = d3.scaleOrdinal()
      .domain(['g1', 'g2', 'g3', 'g4','g5'])
      .range(['#42A5B3', '#95A17E', '#E3BA22', '#E6842A', '#E25A42'])

    
    elements = svg.selectAll('.bubble')
          .data(nodes, d => d.actor )
          .enter()
          .append('g')

    var bubbles = elements
           .append('circle')
           .classed('bubble', true)
           .attr('r', 0)
           .attr('fill', function(d){return fillcolor(d.group)})
           .attr('cx', function (d) { return d.x; })
           .attr('cy', function (d) { return d.y; })
           .attr('stroke', function(d){return d3.rgb(fillcolor(d.group)).darker();})
           .attr('stroke-width', 2)
           .on('mouseover', showDetail)
           .on('mouseout', hideDetail);

    var labels = elements
           .append("text")
           .attr('dy', '3em')
           .style('text-anchor', 'middle')
           .style('font-size', 10)
           .text(d => d.actor)


    bubbles.transition()
        .duration(2000)
        .attr('r', function(d){return d.radius})
        
    

    // constraints for force simulation
    var center = {x: width / 2, y: height / 2};
    var forceStrength = 0.03;

   

    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('collision', d3.forceCollide().radius(d => d.radius + 5));
       
      
    simulation.stop() 
    
    // replusion strength 
    function charge(d) {
       return -forceStrength * Math.pow(d.radius, 4.0);
    }

   

    // moving bubble to the new position
    function ticked() {
      bubbles
       .attr('cx', d => d.x)
       .attr('cy', d => d.y)

      labels
       .attr('x', d => d.x)
       .attr('y', d => d.y-25)

    }   

    simulation.nodes(nodes)
       .on('tick', ticked)
       .restart();

    /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
     function showDetail(d) {
    // change outline to indicate hover state.
        d3.select(this).attr('stroke', 'black');

        var content = '<span class="name">Actor: </span><span class="value">' +
                  d.actor +
                  '</span><br/>' +
                  '<span class="name">Movies: </span><span class="value">$' +
                  d.movies +
                  '</span><br/>';

        tooltip.showTooltip(content, d3.event);
    }

    /*
    * Hides tooltip
    */
    function hideDetail(d) {
      // reset outline
       d3.select(this)
        .attr('stroke', d3.rgb(fillcolor(d.group)).darker());

      tooltip.hideTooltip();
    }


  
})

