import { addToCartFn } from "/js/helpFns/addToCart.js";

// SHOWING DETAILS LOGIC
const productDetailSection = document.querySelector(".product_details-section");
document.addEventListener("DOMContentLoaded", () => {
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
      if (item.dataset.id === "4") {
        detailsItem.style.display = "flex";
      }
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
const cartCounts = document.querySelectorAll(".cart_count");

addQty?.addEventListener("click", () => {
  qty.value = +qty.value + 1;
});
removeQty?.addEventListener("click", () => {
  if (qty.value === "1") {
    return;
  }
  qty.value = +qty.value - 1;
});
const prodId = addToCart?.dataset.id;
addToCart?.addEventListener("click", async () => {
  const req = { qty: +qty.value, id: +prodId };
  const data = await addToCartFn(req);
  cartCounts.forEach((cartCount) => {
    cartCount.textContent = data.cart.length;
  });
});

// META PIXEL EVENT LOGIC

document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtn = document.querySelector("#add-to-cart");
  const productId = addToCartBtn.dataset.id;
  const productName = addToCartBtn.dataset.name;
  const price = addToCartBtn.dataset.price;

  fbq("track", "ViewContent", {
    content_ids: [productId],
    content_name: productName,
    content_type: "product",
    value: parseFloat(price),
    currency: "RSD",
  });
});
