"use strict";

// Filter button

const filterBtn = document.querySelector(".filter-wrapper");
const filterList = document.querySelector(".filter-list");

filterBtn.addEventListener("click", function () {
  filterList.classList.toggle("filter-list--active");
});

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
  cardContainer.append(
    document.querySelector("#skeleton-template").content.cloneNode(true)
  );
}

// Displaying cards
let allCountries = [],
  selectedRegionCountries = [];

getData("https://restcountries.com/v3.1/all").then((countries) => {
  cardContainer.innerHTML = "";
  allCountries = countries.map((country) => {
    const card = cardTemplate.content.cloneNode(true).children[0];
    card.querySelector("img").src = country.flags.svg;
    card
      .querySelector("img")
      .setAttribute("alt", `Flag of ${country.name.common}`);
    card.querySelector("h2").textContent = country.name.common;
    card.querySelector(`[data-value='population']`).textContent =
      formatPopulation(country.population);
    card.querySelector(`[data-value='region']`).textContent = country.region;
    card.querySelector(`[data-value="capital"]`).textContent = country.capital;

    cardContainer.append(card);
    return { name: country.name.common, region: country.region, element: card };
  });

  // const tl = gsap.timeline({ duration: 1 });
  // tl.from(".card", {
  //   opacity: 0,
  //   stagger: 0.25,
  //   ease: "back.easeOut",
  // });

  // Displaying detail page

  // cardContainer.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   if (!e.target.closest(".card")) return;

  //   // const cards = document.querySelectorAll(".card");
  //   const selectedCard = e.target.closest(".card");
  //   const selectedCountry =
  //     selectedCard.querySelector(".country-name").textContent;
  //   const [detailsAboutCountry] = countries.filter(
  //     (country) => country.name.common === selectedCountry
  //   );
  // });
});

function formatPopulation(num) {
  return new Intl.NumberFormat().format(num);
}

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

searchInput.addEventListener("input", function () {
  searchInputFilter(allCountries);
});

window.addEventListener("load", function () {
  searchInput.value = "";
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
}

const filterContainer = document.querySelector(".filter-list");

filterContainer.addEventListener("click", function (e) {
  if (!e.target.dataset.filter) return;

  let selectedRegion = e.target.dataset.filter;
  filterCards(selectedRegion);

  searchInput.addEventListener("input", function () {
    searchInputFilter(allCountries, selectedRegion);
  });
});

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
