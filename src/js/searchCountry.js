import debounce from 'lodash/debounce';

import fetchCountries from './fetchCountries';
import refs from './getRefs';

import countryListTpl from '../templates/listOfCountries.hbs';
import countryCardTpl from '../templates/oneCountry.hbs';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

let searchCountry = '';

refs.inputSearch.addEventListener(
  'input',
  debounce(() => {
    onSearch();
  }, 500),
);

function onSearch() {
  searchCountry = refs.inputSearch.value;
  if (searchCountry) {
    fetchCountries(searchCountry).then(countryCheck).catch(onFetchError);
  }
  if (!searchCountry) {
    clearMarkup();
  }
}

function onFetchError(error) {
  console.log(error);
}

function countryCheck(country) {
  if (country.length > 10) {
    clearMarkup();
    tooMuch();
  } else if (country.length <= 10 && country.length > 1) {
    clearMarkup();
    renderCountryCard(countryListTpl, country);
  } else if (country.length === 1) {
    clearMarkup();
    renderCountryCard(countryCardTpl, country[0]);
  }
}

function renderCountryCard(template, country) {
  const markup = template(country);
  console.log(markup);
  refs.jsCardContainer.innerHTML = markup;
}

function tooMuch() {
  error({
    text: `Too many matches found. Please enter a more specific query!`,
  });
}

function clearMarkup() {
  refs.jsCardContainer.innerHTML = '';
}
