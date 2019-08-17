// Multi Bar Chart (budget/Profit)

d3.json("../top_movies_updated.json", function(error, myData){
    console.log(myData)

    var budget = []
    var gross = []
    var title = []

    myData.forEach(function(d){
        title.push(d.Title)
        budget.push(d.Budget)
        gross.push(d.Gross_world_wide)
        


    })
    console.log(title)
    console.log(budget)
    console.log(gross)











})


