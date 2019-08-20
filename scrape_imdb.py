from splinter import Browser
from bs4 import BeautifulSoup

import re
import pandas as pd

def init_browser():
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)

def scrape_all():
    # initiate the browser
    browser = init_browser()
    news_title, news_p = mars_news(browser)
    
    marsdata = {
        "news_title" : news_title,
        "news_paragraph" : news_p,
        "feature_image_url" : feature_image(browser),
        "mars_weather" : mars_weather(browser),
        "mars_fact" : mars_fact(),
        "hemisphere_image_urls" : hemisphere_image_urls(browser)
    } 

    return marsdata