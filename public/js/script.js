import { addToCartFn } from "/js/helpFns/addToCart.js";

// GLOBAL VARIABLES

const header = document.querySelector("header");
const links = document.querySelectorAll("header .navigation-list-item a");
const cartCount = document.querySelectorAll(".cart_count");
const productsMenuToggle = document.querySelector("#products_menu-toggle");
const productsMenu = document.querySelector(".products_menu");
const skinConcernMenuToggle = document.querySelector(
  "#skin_concern-menu_toggle"
);
const skinConcernMenu = document.querySelector(".skin_concern-menu");
const phoneHeader = document.querySelector(".header_phone");
const phoneDropMenu = document.querySelector(".phone_drop-menu");
const closeMenu = phoneDropMenu.querySelector("#drop_menu-close");
const openMenu = phoneDropMenu.querySelector("#drop_menu-open");
const navigationMenu = phoneDropMenu.querySelector(".phone_menu-navigation");

// SCROLL HEADER LOGIC

const scrollEffect = () => {
  if (window.location.pathname === "/") {
    if (window.scrollY > 1) {
      header.classList.add("scrolled");
      phoneHeader.classList.add("scrolled");
      links.forEach((link) => link.classList.add("scrolled-link"));
      productsMenu.style.backgroundColor = "#faf9f7";
      skinConcernMenu.style.backgroundColor = "#faf9f7";
    } else {
      if (navigationMenu.classList.contains("open")) {
        return;
      }
      header.classList.remove("scrolled");
      phoneHeader.classList.remove("scrolled");
      links.forEach((link) => link.classList.remove("scrolled-link"));
      productsMenu.style.backgroundColor = "transparent";
      skinConcernMenu.style.backgroundColor = "transparent";
    }
  }
};

document.addEventListener("scroll", scrollEffect);

const scrollEffectOnLoad = () => {
  if (window.location.pathname !== "/") {
    header.style.position = "sticky";
    phoneHeader.style.position = "sticky";
    header.classList.add("scrolled");
    phoneHeader.classList.add("scrolled");
    links.forEach((link) => link.classList.add("scrolled-link"));
    productsMenu.style.backgroundColor = "#faf9f7";
    skinConcernMenu.style.backgroundColor = "#faf9f7";
  }
};

document.addEventListener("DOMContentLoaded", scrollEffectOnLoad);

//  DROP MENU LOGIC

productsMenuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  productsMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (
    !productsMenu.contains(event.target) &&
    !productsMenuToggle.contains(event.target)
  ) {
    productsMenu.classList.remove("open");
  }
});

skinConcernMenuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  skinConcernMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (
    !skinConcernMenu.contains(event.target) &&
    !skinConcernMenuToggle.contains(event.target)
  ) {
    skinConcernMenu.classList.remove("open");
  }
});
// PHONE DROP MENU

let isAnimating = false;

const closeMenuFn = (close) => {
  closeMenu.style.display = "none";
  openMenu.style.display = "block";
  if (close) {
    isAnimating = true;
    navigationMenu.classList.add("closing");
    navigationMenu.addEventListener(
      "transitionend",
      () => {
        navigationMenu.classList.remove("open");
        navigationMenu.classList.remove("closing");
        isAnimating = false;
      },
      { once: true }
    );
  } else {
    navigationMenu.classList.remove("open");
  }
  document.querySelector("body").style.overflow = "";
  scrollEffect();
};

openMenu.addEventListener("click", () => {
  if (isAnimating) return;
  scrollEffect();
  phoneHeader.classList.add("scrolled");
  openMenu.style.display = "none";
  closeMenu.style.display = "block";
  navigationMenu.classList.add("open");
  document.querySelector("body").style.overflow = "hidden";
});
closeMenu.addEventListener("click", () => {
  closeMenuFn(true);
});

const scrollLinks = document.querySelectorAll("a[href^='#']");
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname !== "/") {
    scrollLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        closeMenuFn(true);
        const targetId = link.getAttribute("href");
        sessionStorage.setItem("scrollTo", targetId);
        window.location.href = "/";
      });
    });
  } else {
    scrollLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        closeMenuFn(true);
      });
    });
    const scrollTo = sessionStorage.getItem("scrollTo");
    if (scrollTo) {
      console.log(scrollTo);
      window.location.href = scrollTo;
      sessionStorage.removeItem("scrollTo");
    }
  }
});

const navigationList = navigationMenu.querySelector(".phone_navigation-list");

navigationList.addEventListener("click", (event) => {
  const navigationItem = event.target.closest(".phone_navigation-item");
  const eventId = navigationItem.dataset.id;
  if (eventId) {
    const submenuList = navigationMenu.querySelector(
      ` .phone_navigation-list.submenu#${eventId}`
    );
    submenuList.classList.add("open");
    const backItem = submenuList.querySelector(".phone_navigation-item.back");
    backItem.addEventListener("click", () => {
      submenuList.classList.add("closing");
      submenuList.addEventListener(
        "transitionend",
        () => {
          submenuList.classList.remove("open");
          submenuList.classList.remove("closing");
          return;
        },
        { once: true }
      );
    });
    const subMenuItems = submenuList.querySelectorAll(
      "a .phone_navigation-item"
    );
    subMenuItems.forEach((item) =>
      item.addEventListener("click", () => {
        closeMenuFn(false);
        submenuList.classList.remove("open");
      })
    );
  }
});

// Add TO Cart Product CARD

const addToCartButtons = document.querySelectorAll("#add-to-cart");
addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    event.preventDefault();
    const prodId = btn.dataset.id;
    const data = await addToCartFn({ qty: 1, id: +prodId });
    cartCount.forEach((count) => (count.textContent = data.cart.length));
  });
});

// SEARCH MODAL LOGIC

const closeModal = document.querySelector(".search_modal-close");
const modal = document.querySelector(".search_modal");
const searchIcons = document.querySelectorAll(".search");
searchIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    console.log("clicked");
    modal.style.display = "block";
  });
});
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// PRODUCT CARD SLIDE SHOW LOGIC
const cardsSlideShow = document.querySelector(".new_products-container");
document.querySelectorAll(".new_product-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    cardsSlideShow.style.animationPlayState = "paused";
  });
  card.addEventListener("mouseleave", () => {
    cardsSlideShow.style.animationPlayState = "running";
  });
});

window.addEventListener("pageshow", function () {
  if (cardsSlideShow) {
    cardsSlideShow.style.animationPlayState = "running";
  }
});
