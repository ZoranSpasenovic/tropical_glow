document.addEventListener("DOMContentLoaded", () => {
  const checkoutDataEl = document.getElementById("checkout-data");
  if (!checkoutDataEl) return;

  const totalPrice = parseFloat(checkoutDataEl.dataset.totalPrice);
  const cart = JSON.parse(checkoutDataEl.dataset.cart);

  fbq("track", "InitiateCheckout", {
    value: totalPrice,
    currency: "RSD",
    contents: cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
    content_type: "product",
  });
});
