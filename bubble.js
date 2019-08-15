 d3.json("top_movies_updated.json", function(error, data){
     console.log(data);
     data.forEach(function(d){
         console.log(d.Title)
     })
})
