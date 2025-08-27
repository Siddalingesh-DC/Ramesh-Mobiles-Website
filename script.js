/* RAMESH MOBILES - script.js
   Handles:
   - product data (50 realistic entries)
   - index page rendering with search/sort/infinite scroll
   - details page display
   - cart system + cart UI
   - auth (signup/login) stored in localStorage (demo)
   - checkout simulation & orders saved to localStorage
*/

(function(){
  const KEY_PRODUCTS = 'rm_products_v2';
  const KEY_CART = 'rm_cart_v2';
  const KEY_USERS = 'rm_users_v2';
  const KEY_LOGGED = 'rm_logged_v2';
  const KEY_ORDERS = 'rm_orders_v2';

  // If not present, generate realistic product list (50)
  if (!localStorage.getItem(KEY_PRODUCTS)) {
    const products = [
      // 20 unique product images used then reused for variety
      {id:1, name:'Apple iPhone 15 Pro Max', price:119900, image:'https://m.media-amazon.com/images/I/61hZllqYwOL._SX679_.jpg', description:'Apple iPhone 15 Pro Max — A16 Bionic, Pro camera system.'},
      {id:2, name:'Apple iPhone 15', price:79900, image:'https://m.media-amazon.com/images/I/71GM8l1Yc2L._SX679_.jpg', description:'Apple iPhone 15 — Sleek design and great camera.'},
      {id:3, name:'Samsung Galaxy S23 Ultra', price:114999, image:'https://m.media-amazon.com/images/I/81oTeGFk2tL._SX679_.jpg', description:'Samsung Galaxy S23 Ultra — flagship camera and display.'},
      {id:4, name:'Samsung Galaxy S23', price:74999, image:'https://m.media-amazon.com/images/I/61ZlF7Yv7PL._SX679_.jpg', description:'Samsung Galaxy S23 — premium performance.'},
      {id:5, name:'OnePlus 12', price:69999, image:'https://m.media-amazon.com/images/I/71Q0Jy8A7NL._SX679_.jpg', description:'OnePlus 12 — fast, smooth, great value.'},
      {id:6, name:'OnePlus 11', price:44999, image:'https://m.media-amazon.com/images/I/71d1ytcCntL._SX679_.jpg', description:'OnePlus 11 — flagship level performance.'},
      {id:7, name:'Google Pixel 8 Pro', price:89999, image:'https://m.media-amazon.com/images/I/71q6Q7gJw4L._SX679_.jpg', description:'Google Pixel 8 Pro — stock Android & camera AI.'},
      {id:8, name:'Google Pixel 8', price:59999, image:'https://m.media-amazon.com/images/I/71Y6h3w0zqL._SX679_.jpg', description:'Google Pixel 8 — brilliant camera and smooth UI.'},
      {id:9, name:'Xiaomi 14 Pro', price:69999, image:'https://m.media-amazon.com/images/I/71hNjg8ZVCL._SX679_.jpg', description:'Xiaomi 14 Pro — great specs at value price.'},
      {id:10, name:'Xiaomi Redmi Note 13 Pro', price:27999, image:'https://m.media-amazon.com/images/I/61Cz4Q8tOHL._SX679_.jpg', description:'Redmi Note 13 Pro — excellent mid-range choice.'},
      {id:11, name:'Vivo X100 Pro', price:79999, image:'https://m.media-amazon.com/images/I/71ep8gZdmCL._SX679_.jpg', description:'Vivo X100 Pro — premium camera & design.'},
      {id:12, name:'Oppo Find X7 Pro', price:74999, image:'https://m.media-amazon.com/images/I/71sG8q0wY5L._SX679_.jpg', description:'Oppo Find X7 Pro — flagship display.'},
      {id:13, name:'Realme GT 5', price:43999, image:'https://m.media-amazon.com/images/I/71PzjUxRg-L._SX679_.jpg', description:'Realme GT 5 — high refresh & performance.'},
      {id:14, name:'iQOO 12', price:49999, image:'https://m.media-amazon.com/images/I/61HHS0HrjpL._SX679_.jpg', description:'iQOO 12 — gamer-focused powerhouse.'},
      {id:15, name:'Nothing Phone 2', price:37999, image:'https://m.media-amazon.com/images/I/61M6jQzQt1L._SX679_.jpg', description:'Nothing Phone 2 — unique design and OS.'},
      {id:16, name:'Samsung Galaxy A54', price:27999, image:'https://m.media-amazon.com/images/I/71J1D4Zh5FL._SX679_.jpg', description:'Galaxy A54 — balanced midrange.'},
      {id:17, name:'Motorola Edge 40', price:35999, image:'https://m.media-amazon.com/images/I/61q6Lx1gHGL._SX679_.jpg', description:'Motorola Edge 40 — near-stock Android.'},
      {id:18, name:'Asus ROG Phone 7', price:79999, image:'https://m.media-amazon.com/images/I/61CD6kZ6mAL._SX679_.jpg', description:'ROG Phone 7 — ultimate gaming phone.'},
      {id:19, name:'Sony Xperia 1 V', price:114999, image:'https://m.media-amazon.com/images/I/71m2XvJ5uvL._SX679_.jpg', description:'Xperia 1 V — cinematic display & pro camera.'},
      {id:20, name:'Nokia XR21', price:29999, image:'https://m.media-amazon.com/images/I/61kQkZc0rRL._SX679_.jpg', description:'Nokia XR21 — rugged & reliable.'},
      // we'll produce additional 30 names by varying brand+index
    ];

    const brands = ['Zenith','Aurora','Nebula','Orion','Atlas','Viva','Nexus','Luma','Aero','Pulse','Crest','Delta','Echo','Flux','Gala'];
    let nextId = 21;
    for (let i = 0; i < 30; i++){
      const brand = brands[i % brands.length];
      const id = nextId++;
      products.push({
        id,
        name: `${brand} F${id}`,
        price: Math.round(12000 + Math.random()*70000),
        image: `https://via.placeholder.com/400x300?text=${encodeURIComponent(brand+'+'+id)}`,
        description: `The ${brand} F${id} is a capable phone with solid battery and camera for everyday use.`
      });
    }

    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
  }

  // ensure other keys
  if (!localStorage.getItem(KEY_CART)) localStorage.setItem(KEY_CART, JSON.stringify([]));
  if (!localStorage.getItem(KEY_USERS)) localStorage.setItem(KEY_USERS, JSON.stringify([]));
  if (!localStorage.getItem(KEY_LOGGED)) localStorage.setItem(KEY_LOGGED, JSON.stringify(null));
  if (!localStorage.getItem(KEY_ORDERS)) localStorage.setItem(KEY_ORDERS, JSON.stringify([]));

  // expose RM global API
  window.RM = {
    getProducts: ()=> JSON.parse(localStorage.getItem(KEY_PRODUCTS)),
    getCart: ()=> JSON.parse(localStorage.getItem(KEY_CART)),
    setCart: (c)=> localStorage.setItem(KEY_CART, JSON.stringify(c)),
    getUsers: ()=> JSON.parse(localStorage.getItem(KEY_USERS)),
    getOrders: ()=> JSON.parse(localStorage.getItem(KEY_ORDERS)),
    setOrders: (o)=> localStorage.setItem(KEY_ORDERS, JSON.stringify(o)),
    addToCart(item){
      const cart = this.getCart();
      cart.push(item);
      this.setCart(cart);
      updateCartCountUI();
      return cart;
    },
    removeFromCart(index){
      const cart = this.getCart();
      cart.splice(index,1);
      this.setCart(cart);
      updateCartCountUI();
      return cart;
    },
    clearCart(){ this.setCart([]); updateCartCountUI(); },
    signup(user){
      const users = this.getUsers();
      if(users.find(u=>u.email===user.email)) return {ok:false,msg:'Email already used'};
      users.push(user); localStorage.setItem(KEY_USERS, JSON.stringify(users)); return {ok:true};
    },
    login(email,password){
      const users = this.getUsers();
      const u = users.find(x=> x.email===email && x.password===password);
      if(!u) return {ok:false,msg:'Invalid credentials'};
      localStorage.setItem(KEY_LOGGED, JSON.stringify({name:u.name,email:u.email}));
      return {ok:true,user:{name:u.name,email:u.email}};
    },
    logout(){ localStorage.setItem(KEY_LOGGED, JSON.stringify(null)); },
    getLogged(){ return JSON.parse(localStorage.getItem(KEY_LOGGED)); },
    placeOrder(order){
      const orders = this.getOrders();
      orders.unshift(order);
      this.setOrders(orders);
    }
  };

  // UI helpers
  window.updateCartCountUI = function(){
    const c = RM.getCart().length;
    const el = document.getElementById('cartCount');
    if(el) el.textContent = c;
    const el2 = document.getElementById('cartCountDetails');
    if(el2) el2.textContent = c;
  };

  /* ========== Index page logic ========== */
  window.initIndexPage = function(){
    const container = document.getElementById('productGrid');
    if(!container) return; // not on index page

    const all = RM.getProducts();
    let filtered = [...all];

    // pagination / infinite scroll settings
    const PAGE_SIZE = 12;
    let page = 0;
    let loading = false;

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadingEl = document.getElementById('loading');

    function renderChunk() {
      const start = page * PAGE_SIZE;
      const chunk = filtered.slice(start, start + PAGE_SIZE);
      chunk.forEach(p => container.appendChild(makeCard(p)));
      page++;
      if (page * PAGE_SIZE >= filtered.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'inline-block';
      }
    }

    function resetAndRender() {
      container.innerHTML = '';
      page = 0;
      renderChunk();
    }

    // create card element
    function makeCard(p){
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <div class="product-title">${p.name}</div>
        <div class="product-price">₹${p.price.toLocaleString()}</div>
        <div class="product-actions">
          <button class="btn view-btn" data-id="${p.id}">View</button>
          <button class="btn buy-btn" data-id="${p.id}">Add</button>
        </div>
      `;
      // handlers
      card.querySelector('.view-btn').addEventListener('click', ()=>{
        localStorage.setItem('rm_selected', p.id);
        window.location.href = 'details.html';
      });
      card.querySelector('.buy-btn').addEventListener('click', ()=>{
        RM.addToCart(p);
        alert(`${p.name} added to cart`);
      });
      return card;
    }

    // search
    const searchBar = document.getElementById('searchBar');
    if(searchBar) {
      searchBar.addEventListener('input', (e)=>{
        const q = e.target.value.trim().toLowerCase();
        filtered = RM.getProducts().filter(p => p.name.toLowerCase().includes(q));
        container.innerHTML = '';
        page = 0;
        renderChunk();
      });
    }

    // sort
    const sortSel = document.getElementById('sortSelect');
    if(sortSel){
      sortSel.addEventListener('change', ()=>{
        const v = sortSel.value;
        filtered = RM.getProducts().slice(); // copy
        if(v === 'price-asc') filtered.sort((a,b)=> a.price - b.price);
        else if(v === 'price-desc') filtered.sort((a,b)=> b.price - a.price);
        else if(v === 'name-asc') filtered.sort((a,b)=> a.name.localeCompare(b.name));
        container.innerHTML = '';
        page = 0;
        renderChunk();
      });
    }

    // load more button
    loadMoreBtn.addEventListener('click', ()=>{
      if(loading) return;
      loading = true;
      loadingEl.style.display = 'block';
      setTimeout(()=> {
        renderChunk();
        loadingEl.style.display = 'none';
        loading = false;
      }, 400);
    });

    // infinite scroll: load next chunk when scrolled near bottom
    window.addEventListener('scroll', ()=>{
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200);
      if(nearBottom && !loading && (page * PAGE_SIZE < filtered.length)) {
        loading = true;
        loadingEl.style.display = 'block';
        setTimeout(()=> {
          renderChunk();
          loadingEl.style.display = 'none';
          loading = false;
        }, 400);
      }
    });

    // initial render
    filtered = RM.getProducts().slice();
    renderChunk();
  };

  /* ========== Details page logic ========== */
  window.showProductDetailFromStorage = function(){
    const el = document.getElementById('productDetail');
    if(!el) return;
    const sel = localStorage.getItem('rm_selected');
    const product = RM.getProducts().find(p=> String(p.id) === String(sel));
    if(!product){ el.innerHTML = '<p>Product not found</p>'; return; }
    el.innerHTML = `
      <div class="product-detail-card-inner" style="display:flex;gap:22px">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-detail-info">
          <h2>${product.name}</h2>
          <p class="product-price">₹${product.price.toLocaleString()}</p>
          <p style="color:var(--muted)">${product.description}</p>
          <div style="margin-top:16px">
            <button class="btn buy-btn" id="detailAdd">Add to cart</button>
            <button class="btn view-btn" id="detailBuy">Buy Now</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('detailAdd').addEventListener('click', ()=>{
      RM.addToCart(product);
      alert('Added to cart');
    });
    document.getElementById('detailBuy').addEventListener('click', ()=> {
      RM.addToCart(product);
      window.location.href = 'cart.html';
    });
  };

  /* ========== Cart page logic ========== */
  window.renderCartPage = function(){
    const el = document.getElementById('cartItems');
    if(!el) return;
    const cart = RM.getCart();
    el.innerHTML = '';
    if(cart.length === 0){ el.innerHTML = '<p class="muted">Your cart is empty</p>'; document.getElementById('cartTotal').textContent = '0'; return; }
    let total = 0;
    cart.forEach((item, idx)=>{
      total += item.price;
      const node = document.createElement('div');
      node.className = 'cart-item';
      node.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div style="flex:1">
          <div style="font-weight:700">${item.name}</div>
          <div style="color:var(--muted)">₹${item.price.toLocaleString()}</div>
        </div>
        <div>
          <button class="btn view-btn remove-btn" data-idx="${idx}">Remove</button>
        </div>
      `;
      el.appendChild(node);
    });
    document.getElementById('cartTotal').textContent = total.toLocaleString();
    // attach remove handlers
    el.querySelectorAll('.remove-btn').forEach(b=>{
      b.addEventListener('click', ()=> {
        const idx = parseInt(b.getAttribute('data-idx'));
        RM.removeFromCart(idx);
        renderCartPage();
      });
    });
  };

  /* ========== Checkout / Orders ========= */
  window.tryCheckout = function(){
    const logged = RM.getLogged();
    if(!logged){
      localStorage.setItem('rm_after_login', 'checkout');
      window.location.href = 'auth.html';
      return;
    }
    const cart = RM.getCart();
    if(cart.length === 0){ alert('Cart is empty'); return; }

    // simulate payment
    if(confirm('Proceed to pay now? (simulation)')){
      const order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cart,
        total: cart.reduce((s,i)=>s+i.price,0),
        buyer: logged
      };
      RM.placeOrder(order);
      RM.clearCart();
      alert('Payment successful — order placed. Thank you, ' + logged.name);
      window.location.href = 'orders.html';
    }
  };

  /* ========== Auth (signup/login) ========= */
  window.signup = function(){
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pw = document.getElementById('signupPassword').value;
    const msg = document.getElementById('signupMsg');
    msg.textContent = '';
    if(!name || !email || !pw){ msg.textContent = 'Please fill all fields'; return; }
    const r = RM.signup({name,email,password:pw});
    if(!r.ok){ msg.textContent = r.msg; } else {
      msg.textContent = 'Account created! Please login.';
      document.getElementById('signupName').value=''; document.getElementById('signupEmail').value=''; document.getElementById('signupPassword').value='';
    }
  };

  window.login = function(){
    const email = document.getElementById('loginEmail').value.trim();
    const pw = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMsg');
    msg.textContent = '';
    if(!email || !pw){ msg.textContent = 'Please fill both fields'; return; }
    const r = RM.login(email,pw);
    if(!r.ok){ msg.textContent = r.msg; } else {
      msg.textContent = 'Login successful. Redirecting...';
      const after = localStorage.getItem('rm_after_login');
      localStorage.removeItem('rm_after_login');
      setTimeout(()=> {
        if(after === 'checkout') window.location.href = 'cart.html';
        else window.location.href = 'index.html';
      },700);
    }
  };

  /* ========== Orders page ========== */
  window.renderOrdersPage = function(){
    const el = document.getElementById('ordersList');
    if(!el) return;
    const logged = RM.getLogged();
    if(!logged){ el.innerHTML = '<p class="muted">Please login to see your orders.</p>'; return; }
    const orders = RM.getOrders().filter(o => o.buyer && o.buyer.email === logged.email);
    if(orders.length === 0){ el.innerHTML = '<p class="muted">No orders yet.</p>'; return; }
    el.innerHTML = '';
    orders.forEach(o=>{
      const node = document.createElement('div');
      node.className = 'order-card';
      node.innerHTML = `
        <div>
          <div style="font-weight:700">${o.id}</div>
          <div class="muted">${new Date(o.date).toLocaleString()}</div>
          <div style="margin-top:6px">Items: ${o.items.length}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">₹${o.total.toLocaleString()}</div>
          <div class="muted">Delivered: Not applicable (demo)</div>
        </div>
      `;
      el.appendChild(node);
    });
  };

  /* ========== Page init ========== */
  document.addEventListener('DOMContentLoaded', ()=>{
    updateCartCountUI();
    // index
    if(document.getElementById('productGrid')) initIndexPage();
    // details
    if(document.getElementById('productDetail')) showProductDetailFromStorage();
    // cart
    if(document.getElementById('cartItems')) renderCartPage();
    // orders
    if(document.getElementById('ordersList')) renderOrdersPage();
    // update auth link label(s)
    const logged = RM.getLogged();
    const authLinks = document.querySelectorAll('#authLink, #authLinkDetails, #authLinkCart');
    authLinks.forEach(a=> {
      if(!a) return;
      a.textContent = logged ? `Hi, ${logged.name}` : 'Login / Sign up';
      a.href = 'auth.html';
    });
  });

})();
