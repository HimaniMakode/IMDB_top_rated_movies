from splinter import Browser
from bs4 import BeautifulSoup
from flask import jsonify
import json
import re
import pandas as pd

def init_browser():
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)

def scrape_all():
    # initiate the browser
    browser = init_browser()
    # get the url for top 250 rated movies
    url = "https://www.imdb.com/chart/top?ref_=nv_mv_250"
    browser.visit(url)
    html = browser.html
    imdb_soup = BeautifulSoup(html, 'html.parser')
    movie_soup = imdb_soup.find_all('td', class_='titleColumn')
    movie_url = []
    for i in movie_soup:
        movie_url.append("https://www.imdb.com"+i.find('a')["href"])
 
    # Create a list of all movies

    top_movie = []
    for i in movie_url:
        top_movie.append(get_movie_info(browser, i))

   
    # store the results in json file

    with open("static/data/top_movies_updated.json", 'w') as file:
        file.write(json.dumps(top_movie, indent=4))

    # get the budget and gross world wide data and store in csv file
    df = pd.read_json("static/data/top_movies_updated.json", orient = "column")
  
    # Cleaning data

    budget = df["Budget"].to_list()

    gross = df["Gross_world_wide"].to_list()

    title = df["Title"].to_list()

    new_budget = []
    new_gross = []
    new_title = []
    # get rid of NaN data
    for i in range(len(budget)):
        if re.findall(r"^\$", budget[i]) and gross[i] != "NaN":
            b = int(budget[i].strip("$"))
            new_budget.append(b)
            new_gross.append(gross[i])
            new_title.append(title[i])
    
    df_updated = {"Title" :new_title , "Budget":new_budget, "Gross":new_gross}

    budget_gross = pd.DataFrame(df_updated)
    
    
    # dropna
    budget_gross = budget_gross.dropna()

    budget_gross.to_csv("static/data/budget_gross.csv")
    
    return {"top_movie": top_movie}

# get the information for the top 250 movies    
def get_movie_info(browser, url):
    
    movie_info = {}
    browser.visit(url)
    html = browser.html
    imdb_soup = BeautifulSoup(html, 'html.parser')
    
    # find movie title

    movie_title = imdb_soup.find('div', class_='title_wrapper').h1.text
    movie_info["Title"] =  movie_title.split("\xa0")[0]

    # find movie year

    year1=  movie_title.split("\xa0")[1].strip('(')
    year2 = year1.split(" ")[0].strip(')')
    movie_info["Year"] = int(year2)
    
    # summary
    
    plot = imdb_soup.find('div', class_='summary_text').text
    movie_info['Summary'] = plot.split("\n")[1].strip()
    
    # image
    
    image_link = imdb_soup.find('div', class_='poster').a["href"]
    full_image_url = "www.imdb.com" + image_link
    movie_info['Image_url'] = full_image_url
    
    
    # cast list

    cast_list  = imdb_soup.find("table", class_ = "cast_list").find_all("td", class_ = "primary_photo")

    list_cast = []
    for i in cast_list:
        name = i.find("a").find("img")["alt"]
        list_cast.append(name)

    movie_info["Cast_list"] = list_cast
    
    # rate, length, category, date

    subtext = imdb_soup.find('div', class_='subtext').text
    text1 = subtext.replace("\n", "")
    text2 = text1.replace(" ", "")
    sub_text = text2.split('|')

    movie_info["Genres"] = sub_text [-2]
    movie_info["Length"] = sub_text [-3]
        
    # rating info

    rating_info = imdb_soup.find('div', class_='ratingValue').find('strong')['title']
    movie_info["Rating_info"] = rating_info 
    
    
    # text 

    text = imdb_soup.find('div', id='titleDetails')
    text_info = text.find_all('div', class_ = "txt-block") 
    t_info = []
    for i in text_info:
        t_info.append(i.text.replace("\n", ""))
    
    # find the budget

    budget = 0
    for m in t_info:
        if re.findall(r"^Budget",m):
            j = m.split(" ")
            string_budget = (j[0].split(":")[1]).strip()
            budget = string_budget.replace(',','')
            
    if budget == 0:
        movie_info['Budget'] = "NaN"
    else:
        movie_info['Budget'] = budget

    # find gross USA

    gross_USA = 0
    for m in t_info:
            if re.findall(r"^Gross",m):
                j = m.split(" ")[2]
                k = j.replace(",", "")
                gross_USA = int(k.strip("$"))
                
    if gross_USA == 0:
        movie_info['Gross_USA'] = "NaN"
    else:
        movie_info['Gross_USA'] = gross_USA

    
    # find gross world_wide 

    gross_world_wide = 0
    for m in t_info:
            if re.findall(r"^Cumulative",m):
                j = m.split(" ")[3]
                k = j.replace(",", "")
                gross_world_wide = int(k.strip("$"))

    if gross_world_wide == 0:
        movie_info['Gross_world_wide'] = "NaN"
    else:
        movie_info['Gross_world_wide'] = gross_world_wide
            
    # Return results
    
    return movie_info
