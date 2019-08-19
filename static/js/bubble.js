// set width and heigh for svg
var width = 1500;
var height = 900;
var svg = null;

// set for bubbles and nodes(circles)
var bubbles = null;


// read the json file
 
d3.json("data/top_movies_updated.json", function(error, data){
    // var a = data[1].Rating_info.split(" ")
    // console.log(a[3].replace(/\,/g, ''));
     var actors = []
     var movies = []
     var ratingSum = []
     var ratingNum = [] 
   
     
     data.forEach(function(d){
         for (var i = 0; i<d.Cast_list.length; i++) {
             a = d.Rating_info.split(" ")
             rating = +a[0]
             ratNum = +a[3].replace(/\,/g, '')
             actors.push(d.Cast_list[i])
             movies.push(d.Title)
             ratingSum.push(rating*ratNum)
             ratingNum.push(ratNum)
         }  
     })
    
    // create an object with actor as key and movie(s) the actor in as value
    // create an array for actor list 

     var actorMovies = new Object()
     var actorList = []
     var actorRatingSum = new Object()
     var actorRatingNum = new Object()
    
     for (var j = 0; j<actors.length; j++){
         if (actorList.indexOf(actors[j]) == -1) {
            actorMovies[actors[j]] = [];
            actorMovies[actors[j]].push(movies[j]);
            actorRatingSum[actors[j]] = [];
            actorRatingSum[actors[j]].push(ratingSum[j]);
            actorRatingNum[actors[j]] = [];
            actorRatingNum[actors[j]].push(ratingNum[j]);
            actorList.push(actors[j])    
         }
         else {
            actorMovies[actors[j]].push(movies[j]); 
            actorRatingSum[actors[j]].push(ratingSum[j]);
            actorRatingNum[actors[j]].push(ratingNum[j]);
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
            aM.rating = (actorRatingSum[actor].reduce((a, b) => a + b, 0))/(actorRatingNum[actor].reduce((a, b) => a + b, 0))
            actorThreeMovies.push(aM)

        }
    })
     
    console.log(actorThreeMovies)

   // create svg

   var svg = d3.select("#vis").append("svg")
     .attr("width", width)
     .attr("height", height)
     .append("g")
     .attr("class", "graph-svg-component")
     .attr("transform", "translate(0,0)")

     svg.append("rect")
     .attr("width", "100%")
     .attr("height", "100%")
     .attr("fill", "pink");


  // tooltip follow circles created by force simulation
  function floatingTooltip(tooltipId, width) {
        // Local variable to hold tooltip div for
        // manipulation in other functions.
        var tt = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .attr('id', tooltipId)
          .style('pointer-events', 'none');
      
        // Set a width if it is provided.
        if (width) {
          tt.style('width', width);
        }
      
        // Initially it is hidden.
        hideTooltip();
      
        /*
         * Display tooltip with provided content.
         *
         * content is expected to be HTML string.
         *
         * event is d3.event for positioning.
         */
        function showTooltip(content, event) {
          tt.style('opacity', 1.0)
            .html(content);
      
          updatePosition(event);
        }
      
        /*
         * Hide the tooltip div.
         */
        function hideTooltip() {
          tt.style('opacity', 0.0);
        }
      
        /*
         * Figure out where to place the tooltip
         * based on d3 mouse event.
         */
        function updatePosition(event) {
          var xOffset = 20;
          var yOffset = 10;
      
          var ttw = tt.style('width');
          var tth = tt.style('height');
      
          var wscrY = window.scrollY;
          var wscrX = window.scrollX;
      
          var curX = (document.all) ? event.clientX + wscrX : event.pageX;
          var curY = (document.all) ? event.clientY + wscrY : event.pageY;
          var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
                       curX - ttw - xOffset * 2 : curX + xOffset;
      
          if (ttleft < wscrX + xOffset) {
            ttleft = wscrX + xOffset;
          }
      
          var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
                      curY - tth - yOffset * 2 : curY + yOffset;
      
          if (tttop < wscrY + yOffset) {
            tttop = curY + yOffset;
          }
      
          tt
            .style("display", "block")
            .style('top', tttop + 'px')
            .style('left', ttleft + 'px');
        }
      
        return {
          showTooltip: showTooltip,
          hideTooltip: hideTooltip,
          updatePosition: updatePosition
        };
      }
    // set tooltip
    var tooltip = floatingTooltip('gates_tooltip', 240);

    function showDetail(d) {
        // change outline to indicate hover state.
        d3.select(this).attr('stroke', 'black');
    
        var content = '<span class="name">Actor: </span><span class="value">' +
                      d.actor +
                      '</span><br/>' +
                      '<span class="name">Movie: </span><span class="value">' +
                      d.movies +
                      '</span><br/>' +
                      '<span class="name">Num. of Movies: </span><span class="value">' +
                      d.value +
                      '</span><br/>' +
                      '<span class="name">Rating. of Movies: </span><span class="value">' +
                      d.rating.toFixed(2) +
                      '</span>';
    
        tooltip.showTooltip(content, d3.event)
            .style("left", (d3.mouse(this)[0]+30) + "px")
            .style("top", (d3.mouse(this)[1]+30) + "px")
      }

      function hideDetail(d) {
        // reset outline
        d3.select(this)
          .attr('stroke', d3.rgb(fillcolor(d.group)).darker());
    
        tooltip.hideTooltip();
      }
    
    
    // scale the radius for bubbles
    var maxAmount = d3.max(actorThreeMovies, function(d){return +d.movieNum})

    var radiusScale = d3.scalePow()
           .exponent(1.5)
           .domain([3, maxAmount])
           .range([20, 90])
    
    var ratingScale = d3.scaleLinear()
            .domain([7.5, 9.5])
            .range([0, 900])


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
                rating: +d.rating,
                ratingPos: ratingScale(+d.rating), 
                group : colorGroup(+d.movieNum),
                x: Math.random()*900,
                y: Math.random()*800
            };
     });
    
    nodes.sort(function(a, b){return b.value - a.value});

    console.log(nodes)

   
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
           .style('font-size', 11)
           .style('font-family', 'sans-serif')
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
    

  
})

