'use strict';

import { apiKey } from "./api.js";

const BASE_URL = 'https://newsapi.org/v2/';

const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');


const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
    allowHTML: false,
});

const validateURL = (url) => {
    const pattern = /https:\/\//i;
    return pattern.test(url);
};

const getData = async (url) => {
    const response = await fetch(url, {
        headers:{
            'X-Api-Key': apiKey,
        },
    });
    const data = await response.json();
    return data;
};

const renderCard = (data) => {
    console.log(data);
    newsList.textContent = '';
    const articlesList = data.articles;
    if (articlesList.length > 0){
        [...articlesList].forEach(element => {
            let cardItem = document.createElement('li');
            cardItem.classList.add('news-item');
            cardItem.innerHTML = `
            <li class="news-item">
            <img class="news-image" width="270" height="200" src="${validateURL(element.urlToImage) ? element.urlToImage : ''}" alt="${element.title || ''}">
            <h3 class="news-title">
                <a href="${element.url || '#'}" class="news-link" target="_blank">${element.title || ''}</a>
            </h3>
            <p class="news-description">
            ${element.description || ''}
            </p>
            <div class="news-footer">
                <time class="news-datetime" datetime="${element.publishedAt}">
                    <span>16/03/2022</span> 11:06
                </time>
                <div class="news-author">${element.author || ''}</div>
            </div>
            </li>
            `;
            newsList.append(cardItem);
        });
    } 
     
};

const loadNews = async (country = 'ru') => {
    let url_param = new URL('top-headlines', BASE_URL);
    url_param.searchParams.append('country', country);
    const data = await getData(url_param);
    renderCard(data);
};

choicesElem.addEventListener('input', (e) => {
    const target = e.target;
    const country = target.value;
    if(value) loadNews(country);

});

loadNews();

/* 39:09 */
