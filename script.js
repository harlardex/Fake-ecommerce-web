const endpoint = "https://fakestoreapi.com";
const productContainer = document.getElementById("products");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const productModal = document.getElementById("productModal");
const form = document.getElementById("form");
let products = [];
//Modal controls
openModalBtn.addEventListener("click", () => {
  productModal.classList.add("modal");
});
closeModalBtn.addEventListener("click", () => {
  productModal.classList.remove("modal");
});

//Fetch all product
const fetchProducts = async () => {
  try {
    const response = await fetch(`${endpoint}/products`);
    products = await response.json();
    console.log("products", products);

    products.forEach((product) => {
      displayProduct(product);
    });
  } catch (error) {
    console.error(`Error fetching products:`, error);
  }
};

function renderProducts(products) {
  productContainer.innerHTML = "";
  products.forEach(displayProduct);
}

//Product card
function displayProduct(product) {
  productContainer.innerHTML += `
    <div id="product-${product.id}" class="product">
      <div class="imagecon"><img src="${product.image}" alt="${product.title}"></div>
      <h3>${product.title}</h3>
      <h4>Category: ${product.category}</h4>
      <p class="price">Price: $${product.price}</p>
      <div class="action-buttons">
      <button class="view" onclick="viewProduct(${product.id})">View</button>
      <button class="edit" onclick="editProduct(${product.id})">Edit</button>
      <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    </div>                            `;
}

//Edit product
let editProductId = null;
function editProduct(id) {
  const product = products.find((product) => product.id === id);
  editProductId = id;

  document.getElementById("title").value = product.title;
  document.getElementById("price").value = product.price;
  document.getElementById("description").value = product.description;
  document.getElementById("category").value = product.category;
  document.getElementById("image").value = product.image;

  productModal.classList.add("modal");
}

//Creating product
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const image = document.getElementById("image").value;

  const newProduct = {
    title,
    price: Number(price),
    description,
    category,
    image: image,
  };

  try {
    let response;
    if (editProductId) {
      response = await fetch(`${endpoint}/products/${editProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      products = products.map((product) =>
        product.id === editProductId ? { ...product, ...newProduct } : product,
      );

      renderProducts(products);
    } else {
      response = await fetch(`${endpoint}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      console.log(data);

      products.push(data);
      renderProducts(products);
    }

    alert("Saved successfully");
    editProductId = null;
    form.reset();
    productModal.classList.remove("modal");
  } catch (error) {
    console.log(error);
  }
});

// function updatedProduct(product) {
//   const card = document.getElementById(`${product.id}`)
//   if (!card){return}

//   card.document.getElementById("title").textContent = product.title;
//   card.document.getElementById("price").textContent = product.price;
//   card.document.getElementById("description").textContent = product.description;
//   card.document.getElementById("category").textContent = product.category;
//   card.document.getElementById("image").src = product.image;
//   card.document.getElementById("image").alt = product.image;
// }

//View product details
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

//Deleting a product
async function deleteProduct(id) {
  const confirmDelete = confirm(
    `Are you sure you want to delete this product?`,
  );
  if (!confirmDelete) {
    return;
  }
  try {
    const response = await fetch(`${endpoint}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    const data = await response.json();
    console.log("deleted data", data);
    document.getElementById(`product-${id}`).remove();
    alert("Product deleted successfully");
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});
