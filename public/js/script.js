"use strict";

// Filter button

const filterBtn = document.querySelector(".filter-wrapper");
const filterList = document.querySelector(".filter-list");

if (filterBtn) {
  filterBtn.addEventListener("click", function () {
    filterList.classList.toggle("filter-list--active");
  });
}

// Getting data from API

const getData = async function (url) {
  try {
    const response = await fetch(url);
    const data = response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Skeleton animation on loading data

const cardTemplate = document.getElementById("card-template");
const cardContainer = document.querySelector(".card-list");

for (let i = 0; i < 8; i++) {
  if (cardContainer) {
    cardContainer.append(
      document.querySelector("#skeleton-template").content.cloneNode(true)
    );
  }
}

// Displaying cards

const homeSection = document.querySelector(".home-section");
const detailSection = document.querySelector(".detail-section");
let allCountries = [];

getData("https://restcountries.com/v3.1/all").then((countries) => {
  if (cardContainer) {
    cardContainer.innerHTML = "";
  }
  allCountries = countries.map((country) => {
    if (cardTemplate) {
      const card = cardTemplate.content.cloneNode(true).children[0];
      card.querySelector("img").src = country.flags.svg;
      card
        .querySelector("img")
        .setAttribute("alt", `Flag of ${country.name.common}`);
      card.querySelector("h2").textContent = country.name.common;
      card.querySelector(`[data-value='population']`).textContent =
        formatPopulation(country.population);
      card.querySelector(`[data-value='region']`).textContent = country.region;
      card.querySelector(`[data-value="capital"]`).textContent =
        country.capital;

      cardContainer.append(card);
      return {
        name: country.name.common,
        region: country.region,
        element: card,
      };
    }
  });

  // Displaying detail page

  detailSection.classList.add("hide");

  cardContainer.addEventListener("click", function (e) {
    e.preventDefault();
    if (!e.target.closest(".card")) return;

    const selectedCard = e.target.closest(".card");
    const selectedCountry =
      selectedCard.querySelector(".country-name").textContent;
    const [detailsAboutCountry] = countries.filter(
      (country) => country.name.common === selectedCountry
    );

    // Common name
    detailSection.querySelector(".country-name").textContent =
      detailsAboutCountry.name.common;

    // Flag img
    detailSection.querySelector("img").src = detailsAboutCountry.flags.svg;

    // Native name
    detailSection.querySelector("[data-value=native-name]").textContent =
      detailsAboutCountry.altSpellings[1] || detailsAboutCountry.name.common;

    // Population
    detailSection.querySelector("[data-value=population]").textContent =
      formatPopulation(detailsAboutCountry.population);

    // Region
    detailSection.querySelector("[data-value=region]").textContent =
      detailsAboutCountry.region;

    // Sub region
    detailSection.querySelector("[data-value=subregion]").textContent =
      detailsAboutCountry.subregion;

    // Capital name
    detailSection.querySelector("[data-value=capital]").textContent =
      detailsAboutCountry.capital[0];

    // Tld
    detailSection.querySelector("[data-value=tld]").textContent =
      detailsAboutCountry.tld.join(", ");

    // Currencies
    const currencies = Object.keys(detailsAboutCountry.currencies);
    let currencyNames = [];
    currencies.forEach((currency) => {
      currencyNames.push(detailsAboutCountry.currencies[currency].name);
    });
    detailSection.querySelector("[data-value=currencies]").textContent =
      currencyNames.join(", ");

    // Languages
    detailSection.querySelector("[data-value=languages]").textContent = [
      ...Object.values(detailsAboutCountry.languages),
    ].join(", ");

    // Border countries
    const borderList = detailSection.querySelector(".border-list");

    borderList.innerHTML = "";

    if (!detailsAboutCountry.borders) {
      const html = "<li>No borders</li>";
      borderList.insertAdjacentHTML("beforeend", html);
    } else {
      detailsAboutCountry.borders.forEach((border) => {
        const html = `<li>${border.toUpperCase()}</li>`;
        borderList.insertAdjacentHTML("beforeend", html);
      });
    }

    homeSection.classList.add("hide");
    detailSection.classList.remove("hide");
  });
});

function formatPopulation(num) {
  return new Intl.NumberFormat().format(num);
}

// Back button

const backBtn = document.querySelector(".btn-back");

backBtn.addEventListener("click", function () {
  homeSection.classList.remove("hide");
  detailSection.classList.add("hide");
  searchInput.value = "";
});

// Search input

const searchInput = document.querySelector(".input__text");

function searchInputFilter(countryArr, selectedRegion) {
  const value = searchInput.value.toLowerCase();
  countryArr.forEach((country) => {
    const isVisible = country.name.toLowerCase().includes(value);
    if (!selectedRegion) {
      country.element.classList.toggle("hide", !isVisible);
    } else {
      if (isVisible && country.region.toLowerCase() === selectedRegion) {
        country.element.style.display = "block";
      } else {
        country.element.style.display = "none";
      }
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchInputFilter(allCountries);
  });
}

window.addEventListener("load", function () {
  if (searchInput) {
    searchInput.value = "";
  }
});

// Filtering

function filterCards(selectedRegion) {
  searchInput.value = "";
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.querySelector("[data-value='region']").textContent.toLowerCase() ===
    selectedRegion
      ? (card.style.display = "block")
      : (card.style.display = "none");
  });

  document.querySelector(".filter__text").textContent =
    selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1);
}

const filterContainer = document.querySelector(".filter-list");

if (filterContainer) {
  filterContainer.addEventListener("click", function (e) {
    if (!e.target.dataset.filter) return;

    let selectedRegion = e.target.dataset.filter;
    filterCards(selectedRegion);

    searchInput.addEventListener("input", function () {
      searchInputFilter(allCountries, selectedRegion);
    });
  });
}

// Filtering through keyboard

const filterListItems = document.querySelectorAll(".filter-list li");

filterListItems.forEach((item) => {
  item.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      let selectedRegion = e.target.dataset.filter;
      filterCards(selectedRegion);
      searchInput.addEventListener("input", function () {
        searchInputFilter(allCountries, selectedRegion);
      });
    }
  });
});

// Toggle theme

const body = document.querySelector("body");
const themeBtn = document.querySelector(".btn-theme");
const moonSvg = document.querySelector(".btn-theme__icon");
let themeLocalStorage = localStorage.getItem("theme");

function setDarkTheme() {
  body.dataset.theme = "dark";
  moonSvg.firstElementChild.setAttribute(
    "xlink:href",
    "./assets/icons/all-icons.svg#moon-filled"
  );
  localStorage.setItem("theme", "dark");
}

function setLightTheme() {
  body.dataset.theme = "light";
  moonSvg.firstElementChild.setAttribute(
    "xlink:href",
    "./assets/icons/all-icons.svg#moon"
  );
  localStorage.setItem("theme", "light");
}

function checkTheme() {
  const isDarkEnabled = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  isDarkEnabled ? setDarkTheme() : setLightTheme();
}

if (!themeLocalStorage) {
  checkTheme();
} else {
  themeLocalStorage === "light" ? setLightTheme() : setDarkTheme();
}

themeBtn.addEventListener("click", function () {
  let currentTheme = body.dataset.theme;

  currentTheme === "light" ? setDarkTheme() : setLightTheme();
});
