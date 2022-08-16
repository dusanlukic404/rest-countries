"use strict";

const body = document.querySelector("body");

// Filter button

const filterBtn = document.querySelector(".filter");
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

getData("https://restcountries.com/v3.1/all").then((countries) => {
  cardContainer.innerHTML = "";
  countries.forEach((country) => {
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector(" img").src = country.flags.svg;
    card
      .querySelector("img")
      .setAttribute("alt", `Flag of ${country.name.common}`);
    card.querySelector("h2").textContent = country.name.common;
    card.querySelector(`[data-value='population']`).textContent =
      formatPopulation(country.population);
    card.querySelector(`[data-value='region']`).textContent = country.region;
    card.querySelector(`[data-value="capital"]`).textContent = country.capital;

    cardContainer.append(card);
  });

  gsap.from(".card", {
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.easeOut",
  });
});

function formatPopulation(num) {
  return new Intl.NumberFormat().format(num);
}

// Filtering

const filterContainer = document.querySelector(".filter-list");

filterContainer.addEventListener("click", function (e) {
  if (!e.target.dataset.filter) return;

  let selectedRegion = e.target.dataset.filter;
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.querySelector("[data-value='region']").textContent.toLowerCase() ===
    selectedRegion
      ? (card.style.display = "block")
      : (card.style.display = "none");
  });

  this.classList.remove("filter-list--active");
});

// Toggle theme

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
