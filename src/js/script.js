"use strict";

// Filter region

const filterBtn = document.querySelector(".filter");
const filterList = document.querySelector(".filter-list");

filterBtn.addEventListener("click", function () {
  filterList.classList.toggle("filter-list--active");
});
