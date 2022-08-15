"use strict";

// Filter button

const filterBtn = document.querySelector(".filter");
const filterList = document.querySelector(".filter-list");

filterBtn.addEventListener("click", function () {
  filterList.classList.toggle("filter-list--active");
});

// Getting data from API

const getData = async function (url) {
  const response = await fetch(url);
  const data = response.json();

  return data;
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
    y: 20,
    duration: 1,
    stagger: 0.2,
    ease: "back.easeOut",
  });
});

function formatPopulation(num) {
  return new Intl.NumberFormat().format(num);
}
