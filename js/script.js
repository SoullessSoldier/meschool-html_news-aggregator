'use strict';

import { apiKey } from "./api.js";

const BASE_URL = 'https://newsapi.org/v2/';
const NO_IMAGE = '../img/noimage.jpg';

const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');

const declOfNum = (number, words) => {  
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
};

const convertDateToLocale = (isoDate) => {       
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        'year': 'numeric',
        'month': '2-digit',
        'day': '2-digit',
    });
    const fullTime = date.toLocaleString('en-GB', {
        'hour': '2-digit',
        'minute': '2-digit',
    });;
    return `<span>${fullDate}</span> ${fullTime}`;    
};

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
    return data.articles;
};

const getImage = (url, alt, noImageStr) => new Promise((resolve, reject) => {
    const image = new Image(270, 200);    
    
    image.addEventListener('load', () => {
        resolve(image);
    });

    image.addEventListener('error', () => {
        image.src = noImageStr;
        resolve(image);

    });

    image.src = validateURL(url) ? image.src = url : noImageStr;
    image.classList.add('news-image');
    image.alt = alt || '';

    return image;         
});

const renderCard = (data) => {    
    newsList.textContent = '';    
    if (data.length > 0){
        data.forEach(async ({urlToImage, title, url, description, publishedAt, author }) => {                       
            let cardItem = document.createElement('li');
            cardItem.classList.add('news-item');
            const image = await getImage(urlToImage, title, NO_IMAGE);
            cardItem.append(image);
            const card = `            
            <h3 class="news-title">
                <a href="${url || '#'}" class="news-link" target="_blank">${title || ''}</a>
            </h3>
            <p class="news-description">
            ${description || ''}
            </p>
            <div class="news-footer">
                <time class="news-datetime" datetime="publishedAt">
                ${convertDateToLocale(publishedAt)}  
                </time>
                <div class="news-author">${author || ''}</div>
            </div>
            `;
            cardItem.insertAdjacentHTML('beforeend', card);
            newsList.append(cardItem);
        });
    } 
     
};

const loadNews = async (category = 'science', pageSize = '50') => {
    const preloader = document.createElement('li');
    preloader.classList.add('preload');
    newsList.textContent = '';
    newsList.append(preloader);
    title.classList.add('hide');
    
    const url_param = new URL('top-headlines', BASE_URL);

    const country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);

    url_param.searchParams.append('country', country);
    url_param.searchParams.append('category', category);
    url_param.searchParams.append('pageSize', pageSize);
    const data = await getData(url_param);
    renderCard(data);
};

const loadSearch = async (searchString, language = 'ru', pageSize = '50') => {
    const url_param = new URL('everything', BASE_URL);
    url_param.searchParams.append('q', searchString);
    url_param.searchParams.append('language', language);
    url_param.searchParams.append('pageSize', pageSize);
    const data = await getData(url_param);
    title.textContent = `По вашему запросу "${searchString}" найдено ${data.length} ${declOfNum(data.length, ['результат', 'результата', 'результатов'])}`;
    title.classList.remove('hide');
    choices.setChoiceByValue('');
    renderCard(data);
};

choicesElem.addEventListener('change', (e) => {
    const target = e.target;
    const country = target.value;
    /* const country = e.details.value */
    localStorage.setItem('country', country);
    loadNews();
});

formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    loadSearch(formSearch.search.value);
    formSearch.reset();
    title.classList.add('hide');
});

loadNews();

/* 39:09 */
