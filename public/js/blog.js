const loader = document.querySelector(".loader");
const blog = document.querySelector(".blog_cards-container");
const blogHeading = document.querySelector(".blog_page-heading");
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.style.display = "none";
    blog.style.opacity = "1";
    blogHeading.style.opacity = "1";
  }, 500);
});
