const loader = document.querySelector(".loader");
const section = document.querySelector("section");
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.style.display = "none";
    section.style.opacity = "1";
  }, 350);
});
