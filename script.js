
const products = [
  {
    id: 1,
    name: "FlexiView Phone Stand",
    category: "Phone Accessories",
    price: 12.99,
    label: "BESTSELLER",
    description: "An adjustable stand for video calls, watching videos and studying.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=75"
  },
  {
    id: 2,
    name: "CableTidy Pro",
    category: "Workspace",
    price: 6.99,
    label: "DESK ESSENTIAL",
    description: "Keep your charging cables neat and your desk organized.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=75"
  },
  {
    id: 3,
    name: "Elevate Laptop Stand",
    category: "Workspace",
    price: 24.99,
    label: "WORKSPACE",
    description: "A portable foldable stand for your home or office desk.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=75"
  },
  {
    id: 4,
    name: "Glide Wireless Mouse",
    category: "Computer Accessories",
    price: 16.99,
    label: "DAILY TECH",
    description: "A compact mouse for everyday computer and study tasks.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=75"
  },
  {
    id: 5,
    name: "LumiDesk LED Lamp",
    category: "Workspace",
    price: 19.99,
    label: "DESK ESSENTIAL",
    description: "A modern desk lamp for reading, studying and working.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=75"
  },
  {
    id: 6,
    name: "TechCarry Organizer",
    category: "Travel Accessories",
    price: 14.99,
    label: "TRAVEL",
    description: "Keep cables, adapters and small accessories together.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=75"
  }
];

// All prices and product details above are demonstration data.
const cart = new Map();
let activeCategory = "All";

const $ = (selector) => document.querySelector(selector);

const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);

function renderProducts() {
  const search = $("#searchInput").value.trim().toLowerCase();
  const sort = $("#sortSelect").value;

  let visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const searchableText =
      `${product.name} ${product.category} ${product.description}`.toLowerCase();

    return matchesCategory && searchableText.includes(search);
  });

  if (sort === "low") {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    visibleProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  $("#productTotal").textContent =
    `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;

  $("#emptyState").hidden = visibleProducts.length > 0;

  $("#productGrid").innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'">
        <span class="product-tag">${product.label}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function updateCartCount() {
  let count = 0;

  for (const quantity of cart.values()) {
    count += quantity;
  }

  $("#cartCount").textContent = count;
}

function renderCart() {
  const cartItems = $("#cartItems");
  let subtotal = 0;

  if (cart.size === 0) {
    cartItems.innerHTML = `
      <p class="cart-empty">
        Your cart is empty.<br>
        Explore our products to get started.
      </p>
    `;
  } else {
    cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);

      if (!product) return "";

      subtotal += product.price * quantity;

      return `
        <article class="cart-item">
          <img src="${product.image}" alt="" onerror="this.style.visibility='hidden'">
          <div>
            <h3>${product.name}</h3>
            <span class="line-price">${money(product.price * quantity)}</span>
            <div class="quantity-controls">
              <button data-decrease="${id}" aria-label="Decrease quantity">−</button>
              <span>${quantity}</span>
              <button data-increase="${id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="remove-item" data-remove="${id}" aria-label="Remove ${product.name}">
            ✕
          </button>
        </article>
      `;
    }).join("");
  }

  $("#cartSubtotal").textContent = money(subtotal);
  updateCartCount();
}

function addToCart(id) {
  const current = cart.get(id) || 0;

  if (current >= 99) {
    alert("The maximum quantity for one product is 99.");
    return;
  }

  cart.set(id, current + 1);
  renderCart();
}

function openCart() {
  $("#cartOverlay").hidden = false;
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $("#closeCart").focus();
}

function closeCart() {
  $("#cartOverlay").hidden = true;
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  $("#openCart").focus();
}

function openEnquiry(productId = "") {
  const select = $("#enquiryProduct");

  select.innerHTML = `
    <option value="">Choose a product</option>
    ${products.map((product) => `
      <option value="${product.id}">
        ${product.name} — ${money(product.price)}
      </option>
    `).join("")}
  `;

  if (productId) {
    select.value = String(productId);
  }

  $("#formStatus").textContent = "";
  $("#enquiryModal").hidden = false;
  document.body.classList.add("no-scroll");
  $("#closeEnquiry").focus();
}

function closeEnquiry() {
  $("#enquiryModal").hidden = true;
  document.body.classList.remove("no-scroll");
  $("#contactButton").focus();
}

// Product search and sorting
$("#searchInput").addEventListener("input", renderProducts);
$("#sortSelect").addEventListener("change", renderProducts);

// Product category filters
$("#filterList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
  });

  renderProducts();
});

// Add-to-cart buttons
$("#productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

// Cart quantity and removal buttons
$("#cartItems").addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");

  if (increase) {
    const id = Number(increase.dataset.increase);
    const current = cart.get(id) || 0;

    if (current < 99) cart.set(id, current + 1);
  }

  if (decrease) {
    const id = Number(decrease.dataset.decrease);
    const current = cart.get(id) || 0;

    if (current <= 1) {
      cart.delete(id);
    } else {
      cart.set(id, current - 1);
    }
  }

  if (remove) {
    cart.delete(Number(remove.dataset.remove));
  }

  renderCart();
});

// Cart drawer controls
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);

// Enquiry controls
$("#contactButton").addEventListener("click", () => openEnquiry());
$("#closeEnquiry").addEventListener("click", closeEnquiry);

$("#checkoutButton").addEventListener("click", () => {
  if (cart.size === 0) {
    alert("Your cart is empty. Add a product first.");
    return;
  }

  const firstItem = cart.keys().next().value;
  closeCart();
  openEnquiry(firstItem);
});

$("#enquiryForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const productId = Number(data.get("product"));
  const product = products.find((item) => item.id === productId);

  if (!product) {
    $("#formStatus").textContent = "Please select a product.";
    return;
  }

  const quantity = Number(data.get("quantity"));

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    $("#formStatus").textContent = "Enter a quantity from 1 to 99.";
    return;
  }

  const subject = `GadgetNest product enquiry: ${product.name}`;

  const body = [
    "GadgetNest — Product Enquiry",
    "",
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Contact: ${data.get("contact") || "Not provided"}`,
    `Product: ${product.name}`,
    `Quantity: ${quantity}`,
    `Illustrative item total: ${money(product.price * quantity)}`,
    `Delivery area: ${data.get("location")}`,
    "",
    `Message: ${data.get("message") || "No additional message"}`,
    "",
    "Please confirm actual availability, final price, shipping, and return conditions."
  ].join("\n");

  // Replace this address with your real store email before publishing.
  const storeEmail = "nannhsuyadihtet@gmail.com";

  const mailto =
    `mailto:${storeEmail}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  $("#formStatus").textContent =
    "Opening your email application. If it does not open, configure your email app and try again.";

  window.location.href = mailto;
});

// Mobile navigation
$("#menuToggle").addEventListener("click", () => {
  const isOpen = $("#navigation").classList.toggle("open");

  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").textContent = isOpen ? "✕" : "☰";
});

$("#navigation").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $("#navigation").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    $("#menuToggle").textContent = "☰";
  }
});

// Close overlays with Escape
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (!$("#enquiryModal").hidden) {
    closeEnquiry();
  } else if ($("#cartDrawer").classList.contains("open")) {
    closeCart();
  }
});

// Current year in footer
$("#year").textContent = new Date().getFullYear();

// Initial page rendering
renderProducts();
renderCart();
