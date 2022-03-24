'use strict';

import { apiKey } from "./api.js";

const BASE_URL = 'https://newsapi.org/v2/';

const choicesElem = document.querySelector('.js-choice');
const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
    allowHTML: false,
});


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
};

const loadNews = async () => {
    let url_param = new URL('top-headlines', BASE_URL);
    url_param.searchParams.append('country', 'ru');
    const data = await getData(url_param);
    renderCard(data);
};

loadNews();

/* 39:09 */
