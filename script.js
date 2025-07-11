 
     function hideProducts() {
    document.getElementById("productSection").style.display = "none";
  }//hide products


    function handleLogin(event) {
  event.preventDefault();

  const mail_id = document.getElementById("mail-id").value.trim();
  const lpassword = document.getElementById("login-password").value.trim();

  if (!mail_id || !lpassword) {
    alert("All fields are required");
    return;
  }

  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail_id, lpassword })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.message === "Sign in successfully") {
        document.getElementById("mail-id").value = '';
          document.getElementById("login-password").value = '';

        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
        document.getElementById("productSection").style.display = "flex";

          const firstLetter = mail_id.charAt(0).toUpperCase();

          document.getElementById("usericon").innerHTML = `
          <span class="rounded-circle bg-warning d-inline-flex justify-content-center align-content-center text-dark" style="width: 30px; height: 30px; font-weight="bold";" data-bs-toggle="modal" data-bs-target="#userlogout" title = "My Account"> ${firstLetter} </span>

          `;
          document.getElementById("userMailid").textContent = mail_id;

      }
    })
    .catch(err => {
      alert("Login failed: " + err.message);
    });
}// Login Handle


 function signout(){

    document.getElementById("usericon").innerHTML =`<span class="bi bi-person"> Sign In</span>`;

    document.getElementById("usericon").setAttribute("onclick", "hideproducte()");
      document.getElementById("usericon").setAttribute("data-bs-toggle", "modal");
        document.getElementById("usericon").setAttribute("data-bs-target", "#loginModal");

         bootstrap.Modal.getInstance(document.getElementById("userlogout")).hide();
    alert("You have signed out.");

 } //Sign Out


  function verifyPassword(){
     const password = document.getElementById("password").value.trim();
  const repassword = document.getElementById("repassword").value.trim();
    const error = document.getElementById("error");
       if(password !== repassword){
      error.innerHTML = "Password Not Matched".fontcolor('red');
    }
    else{
      error.innerHTML = "Password Matched".fontcolor('green')
    }

    } // Password Verification

function saveDetails(event){

    event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const number = document.getElementById("number").value.trim();
  const password = document.getElementById("password").value.trim();
  const repassword = document.getElementById("repassword").value.trim();
 
  // Email format check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Mobile number check (10 digits)
  if (!/^\d{10}$/.test(number)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  
  fetch('http://localhost:5000/register', {
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({name, email, number, password, repassword})
  })
  .then(res => res.json())
  .then(data =>{
    alert(data.message)

    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
     document.getElementById("number").value = '';
      document.getElementById("password").value ='';
      document.getElementById("repassword").value ='';

   const newUserModal = bootstrap.Modal.getInstance(document.getElementById("newuser"));
    newUserModal.hide();
   const loginModal =  bootstrap.Modal.getInstance(document.getElementById("loginModal"));
   loginModal.show();

document.getElementById("productSection").style.display = "flex";

  })
   .catch(err => {
      alert("Error: " + err.message);
    });

} // New Register


function searchProducts() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!searchQuery) {
    LoadProducts("https://fakestoreapi.com/products");
    return;
  }
   document.getElementById("searchInput").value = "";
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(products => {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery)
      );

      document.querySelector("main").innerHTML = "";

      if (filtered.length === 0) {
        document.querySelector("main").innerHTML = `
          <div class="alert alert-warning w-100 text-center">
            <strong>No products found for "${searchQuery}".</strong>
          </div>
        `;
        return;
      }

      filtered.forEach(product => {
        let div = document.createElement("div");
        div.className = "card m-2 p-2";
        div.style.width = "190px";
        div.innerHTML = `
          <img src="${product.image}" height="100px" class="card-img-top" onclick="showProductDetails(${product.id})">
          <div class="card-header" style="height:140px">
            <div>${product.title}</div>
          </div>
          <div class="card-body">
            <dl>
              <dt>Price</dt>
              <dd>$${product.price}</dd>
              <dt>Rating</dt>
              <dd><span class="text-success"><span class="bi bi-star-fill"></span></span> ${product.rating.rate} [${product.rating.count}]</dd>
            </dl>
          </div>
          <div class="card-footer">
            <button class="btn btn-danger" onclick="addCart(${product.id}, '${product.title}', '${product.image}', ${product.price})">
              <span class="bi bi-cart3"></span> Add to Cart
            </button>
          </div>
        `;
        document.querySelector("main").appendChild(div);
      });
    });
} // Product Search


    let cartItem = [];
    let allorders = [];

    function BodyLoad() {
      LoadCategories();
      LoadProducts("https://fakestoreapi.com/products");
      cartCount();
    }

    function LoadCategories() {
      fetch("https://fakestoreapi.com/products/categories")
        .then(res => res.json())
        .then(categories => {
          categories.unshift("all");
          categories.forEach(category => {
            let option = document.createElement("option");
            option.text = category.toUpperCase();
            option.value = category;
            document.getElementById("lstCategories").appendChild(option);
          });
        });
    } // Load Categories

    function LoadProducts(url) {
      document.querySelector("main").innerHTML = "";
      fetch(url)
        .then(res => res.json())
        .then(products => {
          products.forEach(product => {
            let div = document.createElement("div");
            div.className = "card m-2 p-2";
            div.style.width = "190px";
            div.innerHTML = `
              <img src="${product.image}" height="100px" class="card-img-top" onclick="showProductDetails(${product.id})">
              <div class="card-header" style="height:140px">
                <div>${product.title}</div>
              </div>
              <div class="card-body">
                <dl>
                  <dt>Price</dt>
                  <dd>$${product.price}</dd>
                  <dt>Rating</dt>
                  <dd><span class="text-success"><span class="bi bi-star-fill"></span></span> ${product.rating.rate} [${product.rating.count}]</dd>
                </dl>
              </div>
              <div class="card-footer">
                <button class="btn btn-danger" onclick="addCart(${product.id}, '${product.title}', '${product.image}', ${product.price})">
                  <span class="bi bi-cart3"></span> Add to Cart 
                </button>
              </div>
            `;
            document.querySelector("main").appendChild(div);
          });
        });
    }

    function loadChangeCategory() {
      let category = document.getElementById("lstCategories").value;
      let url = category === "all"  ? "https://fakestoreapi.com/products" : `https://fakestoreapi.com/products/category/${category}`;
      
      LoadProducts(url);
    }

    function cartCount() {
      document.getElementById("lblCount").innerText = cartItem.length;
    }

    function addCart(id, title, image, price) {
      cartItem.push({ id, title, image, price });
      alert(`${title} Added to Cart Successfully.`);
      cartCount();
      showCart();
    }

    function removeFromCart(index) {
      cartItem.splice(index, 1);
      cartCount();
      showCart();
    }

    function showCart() {
      let tbody = document.querySelector("#cart tbody");
      tbody.innerHTML = "";
      cartItem.forEach((product, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${product.title}</td>
          <td><img src="${product.image}" width="50" height="50"></td>
          <td>$${product.price}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
              <span class="bi bi-trash"></span> Remove
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      document.getElementById("orderBtn").style.display = cartItem.length > 0 ? "block" : "none";
    } // Cart Show


    function placeOrder() {
      if (cartItem.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      let total = cartItem.reduce((sum, p) => sum + p.price, 0);
      alert(`Order placed successfully!\nTotal Amount: $${total.toFixed(2)}`);
      allorders.push(...cartItem);

      cartItem = [];
      cartCount();
      showCart();
    }// PlaceOrder

    function showMyOrders(){
      let html = '';
      if (allorders.length === 0){
        html = ` <div class="alert alert-warning text-center"> No products added yet</div>`;
      }
      else {
        html = `<h4 class="text-center mb-3">Your Ordered Products</h4><div class="row justify-content-center">`;
      

      allorders.forEach(product =>{
            html += `
        <div class="card m-2 p-2" style="width: 180px;">
          <img src="${product.image}" height="100px" class="card-img-top">
          <div class="card-body text-center">
            <div class="fw-bold">${product.title}</div>
            <div class="text-success">$${product.price}</div>
           <button class="btn btn-danger text-center" onclick="cancelOrder(this)">Cancel Order</button>
          </div>
        </div>`;
 });
    html += `</div>`;

    }
    document.getElementById("ordersBody").innerHTML = html;

   const ordersModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("ordersModal"));
   ordersModal.show();
   const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("ordersBody"));
   modal.hide();
    
    }// show ordered Products

  function cancelOrder(button) {
  const card = button.closest(".card");
  const title = card.querySelector(".fw-bold").innerText;

  // Remove from allorders array
  allorders = allorders.filter(product => product.title !== title);

  alert("Order Cancelled");

  // Re-render orders
  showMyOrders();
  
}
  

    function showProductDetails(id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(product => {
          document.getElementById("productImage").src = product.image;
          document.getElementById("productTitle").innerText = product.title;
          document.getElementById("productDescription").innerText = product.description;
          document.getElementById("productPrice").innerText = `$${product.price}`;
          document.getElementById("productRating").innerHTML =
            `<span class="bi bi-star-fill text-warning"></span> ${product.rating.rate} (${product.rating.count} Reviews)`;
          document.getElementById("addToCartBtn").setAttribute("onclick", `addCart(${product.id}, '${product.title}', '${product.image}', ${product.price})`);
          new bootstrap.Modal(document.getElementById("productModal")).show();
        });
    }

    function loadpage(){
      document.querySelector("section").style.display = "flex";
    }


