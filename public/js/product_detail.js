import { addToCartFn } from "/js/helpFns/addToCart.js";

// SHOWING DETAILS LOGIC

document.addEventListener("DOMContentLoaded", () => {
  const productDetailSection = document.querySelector(
    ".product_details-section"
  );
  const productDetails = document.querySelector(
    ".product_detail-content_container"
  );

  const detailsItem = productDetails.querySelectorAll(
    ".product_detail-list_item"
  );
  detailsItem.forEach((item) =>
    item.addEventListener("click", () => {
      const productDetailsDiv = productDetails.querySelector(
        ".product_detail-text"
      );
      productDetailsDiv.classList.add("open");
      productDetailSection.style.overflowY = "visible";

      const backBtnText = productDetailsDiv.querySelector(
        ".product_detail-back_btn span"
      );

      let detailsItem;
      if (item.dataset.id === "1") {
        detailsItem = productDetails.querySelector("#effects-details");
        backBtnText.textContent = "Opis i Efekti";
      } else if (item.dataset.id === "2") {
        detailsItem = productDetails.querySelector("#skin-details");
        backBtnText.textContent = "Tip Kože";
      } else if (item.dataset.id === "3") {
        detailsItem = productDetails.querySelector("#use-details");
        backBtnText.textContent = "Način Upotrebe";
      } else if (item.dataset.id === "4") {
        detailsItem = productDetails.querySelector("#natural-details");
        backBtnText.textContent = "Prirodni Aktivni Sastojci";
      } else if (item.dataset.id === "5") {
        detailsItem = productDetails.querySelector("#ingrd-details");
        backBtnText.textContent = "Sastav";
      }
      detailsItem.style.display = "block";
      const backBtn = productDetailsDiv.querySelector(
        ".product_detail-back_btn"
      );
      backBtn.addEventListener("click", () => {
        detailsItem.style.display = "none";
        productDetailsDiv.classList.remove("open");
        productDetailSection.overflowY = "hidden;";
      });
    })
  );
});
// ADD TO CART LOGIC

const addToCart = document.querySelector(".product_detail-button");
const addQty = document.querySelector(".fa-plus");
const removeQty = document.querySelector(".fa-minus");
const qty = document.querySelector(".qty_value");
const cartCount = document.querySelector(".cart_count");

addQty.addEventListener("click", () => {
  qty.value = +qty.value + 1;
});
removeQty.addEventListener("click", () => {
  if (qty.value === "1") {
    return;
  }
  qty.value = +qty.value - 1;
});
const prodId = addToCart.dataset.id;
addToCart.addEventListener("click", async () => {
  const req = { qty: +qty.value, id: +prodId };
  const data = await addToCartFn(req);
  cartCount.textContent = data.cart.length;
});
