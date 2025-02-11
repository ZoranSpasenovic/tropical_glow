const loader = document.querySelector(".loader");

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.style.display = "none";
  }, 350);
});
