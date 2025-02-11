const edit_buttons = document.querySelectorAll(".edit-btn");

edit_buttons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const listItem = event.target.closest(".admin-product");

    const form = listItem.querySelector(".edit-form");
    const saveButton = listItem.querySelector(".save-btn");
    const editButton = listItem.querySelector(".edit-btn");
    const saleCheck = listItem.querySelector(".sale_check");
    const salePriceLabel = listItem.querySelector(".sale-label_price");
    const salePriceInput = listItem.querySelector(".sale_price");

    form.style.display = "flex";
    saveButton.classList.remove("hidden");
    editButton.classList.add("hidden");
    if (saleCheck.checked) {
      salePriceLabel.classList.remove("hidden");
    }

    saleCheck.addEventListener("change", (event) => {
      if (event.target.checked) {
        salePriceLabel.classList.remove("hidden");
        salePriceInput.setAttribute("required", "");
      } else {
        salePriceLabel.classList.add("hidden");
        salePriceInput.removeAttribute("required");
      }
    });

    saveButton.addEventListener("click", (event) => {
      if (salePriceInput.value < 1 && saleCheck.checked) {
        window.alert("Molim vas unesite cenu za popust");
        event.preventDefault();
        return;
      }
      form.style.display = "none";
      editButton.classList.remove("hidden");
      saveButton.classList.add("hidden");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const scrollPosition = localStorage.getItem("scrollPosition");
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
  }

  window.addEventListener("scroll", function () {
    localStorage.setItem("scrollPosition", window.scrollY);
  });
});

// LOADER
const loader = document.querySelector(".loader");
loader.style.display = "none";
