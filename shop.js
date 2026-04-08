const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏", variants: ["regular", "on a stick", "chocolate covered", "with whipped cream"] },
  banana: { name: "Banana", emoji: "🍌", variants: ["regular", "on a stick", "chocolate covered", "with whipped cream"] },
  lemon: { name: "Lemon", emoji: "🍋", variants: ["regular", "on a stick", "chocolate covered", "with whipped cream"] },
};

function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function addToBasket(product, variant = "regular") {
  const basket = getBasket();
  basket.push({ product, variant });
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((item) => {
    let productKey, variant;
    if (typeof item === 'string') {
      // Old format
      productKey = item;
      variant = 'regular';
    } else {
      // New format
      productKey = item.product;
      variant = item.variant;
    }
    const product = PRODUCTS[productKey];
    if (product) {
      const li = document.createElement("li");
      const variantText = variant === 'regular' ? '' : ` (${variant})`;
      li.innerHTML = `<span class='basket-emoji'>${product.emoji}</span> <span>${product.name}${variantText}</span>`;
      basketList.appendChild(li);
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
