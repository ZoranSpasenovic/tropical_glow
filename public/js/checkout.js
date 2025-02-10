const loader = document.querySelector(".loader");
const checkoutSection = document.querySelector(".checkout_section");

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.style.display = "none";
    checkoutSection.style.opacity = "1";
  }, 350);
});
