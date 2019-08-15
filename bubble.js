 d3.json("top_movies_updated.json", function(error, data){
    //  console.log(data);
     var actors = []
     var movies = []
     data.forEach(function(d){
         for (var i = 0; i<d.Cast_list.length; i++) {
             actors.push(d.Cast_list[i])
             movies.push(d.Title)
         }  
     })
    //  console.log(actors)
    //  console.log(movies)

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
    console.log(actorMovies)
})
