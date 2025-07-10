const tableBody = document.querySelector("tbody");
const subTotal = document.querySelector(".cart_subtotal-price span");
const cartTotal = document.querySelector(".cart_total-price span");
const progressBar = document.querySelector(".progress_bar");
const progressText = document.querySelector(".progress_text");
const progressPrice = progressText?.querySelector("span");
const cartCounts = document.querySelectorAll(".cart_count");
const deliveryPrice = document.querySelector(".cart_subtotal-delivery_price");

// PROGRESS BAR LOGIC

const updateProgressBar = () => {
  const totalPrice = subTotal.textContent.match(/\d+/)[0];
  const progress = +totalPrice / 100;

  if (progress < 100) {
    progressBar.style.width = progress + "%";
    progressText.innerHTML = `Još samo <span>${
      10000 - totalPrice
    }RSD</span> do besplatne dostave`;
  } else {
    progressText.textContent = "Ostvarili ste besplatnu dostavu.";
    progressBar.style.width = "100%";
  }
};
if (progressBar) {
  document.addEventListener("DOMContentLoaded", updateProgressBar);
}

// UPDATE CART LOGIC
const updateCart = async (req) => {
  const response = await fetch("/update-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });
  const data = await response.json();

  return data;
};

tableBody?.addEventListener("click", async (event) => {
  const addBtn = event.target.closest(".plus");
  const removeBtn = event.target.closest(".minus");
  const trashBtn = event.target.closest(".cart_qty-trash");
  const tableRow = event.target.closest(".cart_table-row");
  const prodId = tableRow.dataset.id;
  const qtyValue = tableRow.querySelector(".cart_qty-value");
  const productTotal = tableRow.querySelector(".cart_product-total");

  if (addBtn) {
    qtyValue.value++;
  }
  if (removeBtn) {
    qtyValue.value--;

    if (+qtyValue.value === 0) {
      tableRow.remove();
    }
  }
  if (trashBtn) {
    tableRow.remove();
    qtyValue.value = 0;
  }

  const { cart, totalPrice } = await updateCart({
    id: +prodId,
    qty: +qtyValue.value,
  });
  const productForUpdate = cart.find((prod) => prod.id === +prodId);
  if (productForUpdate) {
    productTotal.textContent = productForUpdate.total + "RSD";
  }

  subTotal.textContent = totalPrice + "RSD";
  cartTotal.textContent = totalPrice + "RSD";
  if (+totalPrice < 10000) {
    deliveryPrice.innerHTML = `<p>Troškovi isporuke nisu uključeni u cenu.</p>`;
  } else {
    deliveryPrice.innerHTML = `<p>Dostava je besplatna.</p>`;
  }
  cartCounts.forEach((cartCount) => {
    cartCount.textContent = cart.length;
  });

  updateProgressBar();
  if (tableBody.children.length === 0) {
    window.location.reload();
  }
});
