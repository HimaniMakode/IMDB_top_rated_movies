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
     for (var j = 0; j<actors.length; j++){
         if (actors[j] in Object.keys(actorMovies)){
            actorMovies[actors[j]].push(movies[j])
         }
         else{
             actorMovies[actors[j]] = []
             actorMovies[actors[j]].push(movies[j])
         }
         
     }
     console.log(actorMovies.keys().length)
})
