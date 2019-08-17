d3.json("data/top_movies_updated.json",function(error,data){
    var genres=[];
    var newGenres=[];
    var allGen={};
    var gens=[];
    var genV=[];
    
    data.forEach(function(d){
            newGenres.push(d.Genres.split(','));
       })
    newGenres.forEach(function(d){
               for (var i=1; i<d.length+1; i++){
                       gens.push(d[i]);
                       genV.push(1/d.length);
               }
               
       })

   var drama = 0;
   var crime = 0;
   var action = 0;
   var biography = 0;
   var adventure = 0;
   var western = 0;
   var comedy = 0;
   var animation = 0;
   var horror = 0;
   var mystery = 0;
   var filmNoir = 0;
   var history=0;
   var fantasy=0;
   var romance=0;
   var sciFi=0;
   var thriller=0;
   var family=0;
   var war=0;
   var music=0;
    var sport=0;


       for (var j=0; j<gens.length; j++){

            if (gens[j]==="Drama") {
                    drama+=genV[j]

            }
            if (gens[j]==="Crime") {
                    crime+=genV[j]
            }
            if (gens[j]==="Action") {
                    action+=genV[j]
            }
            if (gens[j]==="Biography") {
                    biography=biography+genV[j]
            } 
            if (gens[j]==="Adventure") {
                    adventure=adventure+genV[j]
            } 
            if (gens[j]==="Western") {
                    western=western+genV[j]
            } 
            if (gens[j]==="Comedy") {
                    comedy=comedy+genV[j]
            } 
            if (gens[j]==="Animation") {
                    animation=animation+genV[j]
            } 
            if (gens[j]==="Horror") {
                    horror=horror+genV[j]
            } 
            if (gens[j]==="Mystery") {
                    mystery=mystery+genV[j]
            } 
            if (gens[j]==="Film-Noir") {
                    filmNoir=filmNoir+genV[j]
            } 
            if (gens[j]==="History") {
                    history=history+genV[j]
            } 
            if (gens[j]==="Fantasy") {
                    fantasy=fantasy+genV[j]
            } 
            if (gens[j]==="Romance") {
                    romance=romance+genV[j]
            } 
            if (gens[j]==="Sci-Fi") {
                    sciFi=sciFi+genV[j]
            } 
            if (gens[j]==="Thriller") {
                    thriller=thriller+genV[j]
            } 
            if (gens[j]==="Family") {
                    family=family+genV[j]
            } 
            if (gens[j]==="War") {
                    war=war+genV[j]
            } 
            if ((gens[j]==="Music") || (gens[j]==="Musical")) {
                    music=music+genV[j]
            } 
            if (gens[j]==="Sport") {
                    sport=sport+genV[j]
            } 

    }




window.onload = function () {

    var chart = new CanvasJS.Chart("pie", {
            exportEnabled: true,
            animationEnabled: true,
            title:{
                    text: "Movie Genres"
            },
            legend:{
                    cursor: "pointer",
                    itemclick: explodePie
            },
            data: [{
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{name}: <strong>{y}%</strong>",
                    indexLabel: "{name} - {y}%",
                    dataPoints: [
                            { y: parseInt(drama), name: "Drama", exploded: true },
                            { y: parseInt(crime), name: "Crime" },
                            { y: parseInt(action), name: "Action" },
                            { y: parseInt(biography), name: "Biography" },
                            { y: parseInt(adventure), name: "Adventure" },
                            { y: parseInt(western), name: "Western" },
                            { y: parseInt(comedy), name: "Comedy"},
                            { y: parseInt(animation), name: "Animation"},
                            { y: parseInt(horror), name: "Horror"},
                            { y: parseInt(mystery), name: "Mystery"},
                            { y: parseInt(filmNoir), name: "Film-Noir"},
                            { y: parseInt(history), name: "History" },
                            { y: parseInt(fantasy), name: "Fantasy" },
                            { y: parseInt(romance), name: "Romance" },
                            { y: parseInt(sciFi), name: "Sci-Fi" },
                            { y: parseInt(thriller), name: "Thriller" },
                            { y: parseInt(family), name: "Family"},
                            { y: parseInt(war), name: "War"},
                            { y: parseInt(horror), name: "Horror"},
                            { y: parseInt(music), name: "Music"},
                            { y: parseInt(sport), name: "Sport"}
                    ]
            }]
    });
    chart.render();
    }
    
    function explodePie (e) {
            if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
                    e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
            } else {
                    e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
            }
            e.chart.render();
    
    }

})

