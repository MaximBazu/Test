const cartKey = "pureline-cart";

const readCart = () => {
  const stored = localStorage.getItem(cartKey);
  return stored ? JSON.parse(stored) : [];
};

const saveCart = (cart) => {
  localStorage.setItem(cartKey, JSON.stringify(cart));
};

const formatPrice = (value) => `${value.toLocaleString("ru-RU")} ₽`;

const updateCartCount = () => {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;
  const cart = readCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = total;
};

const renderCartModal = () => {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartItems || !cartTotal) return;

  const cart = readCart();
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.textContent = "Корзина пока пуста.";
    cartTotal.textContent = "Итого: 0 ₽";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "modal-item";
    row.innerHTML = `<span>${item.name} × ${item.qty}</span><span>${formatPrice(
      item.price * item.qty
    )}</span>`;
    cartItems.appendChild(row);
  });

  cartTotal.textContent = `Итого: ${formatPrice(total)}`;
};

const setupCatalog = () => {
  const buttons = document.querySelectorAll("[data-product]");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = JSON.parse(button.dataset.product);
      const cart = readCart();
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      saveCart(cart);
      updateCartCount();
      renderCartModal();
    });
  });
};

const setupModal = () => {
  const modal = document.getElementById("cartModal");
  const cartButton = document.getElementById("cartButton");
  const closeModal = document.getElementById("closeModal");
  const checkoutButton = document.getElementById("checkoutButton");

  if (!modal || !cartButton || !closeModal || !checkoutButton) return;

  const openModal = () => {
    renderCartModal();
    modal.hidden = false;
  };

  const hideModal = () => {
    modal.hidden = true;
  };

  cartButton.addEventListener("click", openModal);
  closeModal.addEventListener("click", hideModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });

  checkoutButton.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
};

const renderCheckout = () => {
  const container = document.getElementById("checkoutItems");
  const totalNode = document.getElementById("checkoutTotal");
  if (!container || !totalNode) return;

  const cart = readCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.textContent = "Корзина пуста. Добавьте товары в каталоге.";
    totalNode.textContent = "Итого: 0 ₽";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "modal-item";
    row.innerHTML = `<span>${item.name} × ${item.qty}</span><span>${formatPrice(
      item.price * item.qty
    )}</span>`;
    container.appendChild(row);
  });

  totalNode.textContent = `Итого: ${formatPrice(total)}`;
};

updateCartCount();
setupCatalog();
setupModal();
renderCheckout();
