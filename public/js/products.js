const products = document.querySelector(".products_container");
const loader = document.querySelector(".loader");
const headerContent = document.querySelector(".skin_concern-header");
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.style.display = "none";
    products.style.opacity = "1";
    if (headerContent) headerContent.style.opacity = "1";
  }, 500);
});
