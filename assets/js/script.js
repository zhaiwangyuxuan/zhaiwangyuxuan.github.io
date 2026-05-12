'use strict';


// theme toggle (default: light — see inline script in <head> + localStorage key "theme")
(function setupThemeToggle() {
  function applyAria() {
    var mode = document.documentElement.getAttribute("data-theme") || "light";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", mode === "dark" ? "切换为日间模式" : "切换为夜间模式");
    });
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") || "light";
      var next = cur === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      applyAria();
    });
  });
  applyAria();
})();


// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (!modalContainer) { return; }
  modalContainer.classList.toggle("active");
  if (overlay) { overlay.classList.toggle("active"); }
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    if (!modalImg || !modalTitle || !modalText) { return; }
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
if (modalCloseBtn) { modalCloseBtn.addEventListener("click", testimonialsModalFunc); }
if (overlay) { overlay.addEventListener("click", testimonialsModalFunc); }



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) { selectValue.innerText = this.innerText; }
    if (select) { elementToggleFunc(select); }
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn.length ? filterBtn[0] : null;

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) { selectValue.innerText = this.innerText; }
    filterFunc(selectedValue);

    if (lastClickedBtn) {
      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    }

  });

}

// blog filter
const blogFilterBtns = document.querySelectorAll("[data-blog-filter-btn]");
const blogFilterItems = document.querySelectorAll("[data-blog-filter-item]");

function filterBlog(selectedValue) {
  for (let i = 0; i < blogFilterItems.length; i++) {
    if (selectedValue === "all" || selectedValue === blogFilterItems[i].dataset.category) {
      blogFilterItems[i].classList.add("active");
    } else {
      blogFilterItems[i].classList.remove("active");
    }
  }
}

let lastClickedBlogBtn = blogFilterBtns.length ? blogFilterBtns[0] : null;

for (let i = 0; i < blogFilterBtns.length; i++) {
  blogFilterBtns[i].addEventListener("click", function () {
    filterBlog(this.innerText.toLowerCase());

    if (lastClickedBlogBtn) {
      lastClickedBlogBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBlogBtn = this;
    }
  });
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
if (form && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }

    });
  }
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

function activatePageByNav(targetNav) {
  for (let i = 0; i < pages.length; i++) {
    const active = pages[i].dataset.page === targetNav;
    pages[i].classList.toggle("active", active);
  }
  for (let i = 0; i < navigationLinks.length; i++) {
    const active = navigationLinks[i].dataset.nav === targetNav;
    navigationLinks[i].classList.toggle("active", active);
  }
  window.scrollTo(0, 0);
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const target = this.dataset.nav;
    if (!target) return;
    activatePageByNav(target);
  });
}

(function initNavHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const hasPage = Array.from(pages).some(function (p) { return p.dataset.page === hash; });
  if (hasPage) activatePageByNav(hash);
})();
