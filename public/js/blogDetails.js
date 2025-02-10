const loader = document.querySelector(".loader");
const blogDetails = document.querySelector(".blog_details");

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.style.display = "none";
    blogDetails.style.opacity = "1";
  }, 350);
});
