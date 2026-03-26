const PRODUCTS_PER_PAGE = 4;
var menuData = [];
var filtered = [];
let currentPage = 1;
let page = document.body.dataset.page;
$(document).ready(function(){
    if(page === "cart"){
        renderCart();
    }
getDatas("json/headerNavLinks.json", "get", "json", showLinkList);
getDatas("json/customers.json", "get", "json", showCustomerReviews);
getDatas("json/footerLinks.json", "get", "json", showFooterLinks);
getDatas("json/staff.json", "get", "json", showStaff);
getDatas("json/menu.json", "get", "json", showMenu);
getDatas("json/menu.json", "get", "json", showDatas);
getDatas("json/sort.json", "get", "json", sortDDL);
getDatas("json/help.json", "get", "json", contactForm);
})

//funkcija za dohvatanje podataka
function getDatas(u, t, dt, callback){
$.ajax({
        url:u,
        type:t,
        dataType:dt,
        success: function(result){
            if (typeof callback === "function") {
            callback(result);
            }
            if(page === "menu"){
            renderPagination();
            }
        },
        error: function(jqXHR, exception){
            let msg = "";
            if(jqXHR.status === 0){
                msg = "Not connect. Verify Network.";
            } else if(jqXHR.status == 404){
                msg = "Requested page not found. [404]";
            } else if(jqXHR.status == 500){
                msg = "Internal Server Error [500].";
            } else if(exception === "parsererror"){
                msg = "Requested JSON parse failed.";
            } else if(exception === "timeout"){
                msg = "Time out error.";
            } else if(exception === "abort"){
                msg = "Ajax request aborted.";
            } else {
                msg = "Uncaught Error: " + jqXHR.responseText;
            }
            console.log(msg);
        }
    })
    }

//dinamicki ispis navigacionog menija
var blockLinks = document.getElementsByClassName("linkList");

function showLinkList(result){

    var navLinkDatas = "";
    
    for(let l in result.navigationLinks){
        let link = result.navigationLinks[l];
        navLinkDatas+=`<li class="nav-item"><a class="nav-link click-scroll" href="${link.navLinkUrl}">${link.navLinkName}</a></li>`
    
    }
    for (let bl of blockLinks) {
        bl.innerHTML = navLinkDatas;
    }
}

//dinamicki ispis customera
var blockCustomers = document.getElementsByClassName("timeline");

function showCustomerReviews(result){
    
    var customerBlocks = "";

    for(let customer in result.reviews){
        let c = result.reviews[customer];
        let showStars = '';
        
        for (let star in c.stars) {
            showStars += c.stars[star] ? '<i class="bi-star-fill"></i>' : '<i class="bi-star"></i>';
        }
        
        customerBlocks+=`<div class="timeline-container timeline-container-${c.side}">
                                    <div class="timeline-content">
                                        <div class="reviews-block">
                                            <div class="reviews-block-image-wrap d-flex align-items-center">
                                                <img src="${c.image.url}" class="reviews-block-image img-fluid" alt="${c.image.alt}">
                                                <div class="">
                                                    <h6 class="text-white mb-0">${c.name}</h6>
                                                    <em class="text-white">${c.role}</em>
                                                </div>
                                            </div>
                                            <div class="reviews-block-info">
                                                <p>${c.text}</p>
                                                <div class="d-flex border-top pt-3 mt-4">
                                                    <strong class="text-white">${c.rating}<small class="ms-2">Rating</small></strong>
                                                    <div class="reviews-group ms-auto">
                                                        ${showStars}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>` 
    }
    for (let blc of blockCustomers) {
        blc.innerHTML = customerBlocks;
    }
}

//dinamicki ispis linkova u footer-u
var blockFooterLinks = document.getElementsByClassName("fooLinks");

function showFooterLinks(result){
    
    var footerBlock = "";

    for(let link in result.socialIcons){
        let l = result.socialIcons[link];
        
        footerBlock+=`<li class="social-icon-item">
            <a href="${l.url}" target="${l.target}" class="social-icon-link ${l.iconClass}"></a>
        </li>`; 
    }
    for (let links of blockFooterLinks) {
        links.innerHTML = footerBlock;
    }
}
if(page === "staff"){
//dinamicki ispis radnika
var blockStaff = document.getElementsByClassName("blockStaff")

function showStaff(result){
    var staffBlock = "";

    for(let worker in result.team){
        let w = result.team[worker];

        staffBlock+= `<div class="col-xl-3 col-lg-6 col-md-6 col-12 mb-4">
                                <div class="team-block-wrap">
                                    <div class="team-block-info d-flex flex-column">
                                        <div class="d-flex mt-auto mb-3">
                                            <h4 class="text-white mb-0">${w.personalInfo.firstName} ${w.personalInfo.lastName}</h4>

                                            <p class="badge ms-4"><em>${w.role.title} / ${w.role.department}</em></p>
                                        </div>

                                        <p class="text-white mb-0">${w.description}</p>
                                        <strong><em>${w.contact.email}</em></strong>
                                    </div>

                                    <div class="team-block-image-wrap">
                                        <img src="${w.image.src}" class="team-block-image img-fluid" alt="${w.image.alt}">
                                    </div>
                                </div>
                            </div>`;
    }
    for(let workers of blockStaff){
        workers.innerHTML = staffBlock;
    }
}
}
if(page === "menu"){
//dinamicki ispis menija sa podacima
var blockMenu = document.getElementsByClassName("blockMenu");

function showMenu(result){
    var menuBlock = "";
        menuBlock+=`<div class="col-lg-11 col-12">
                                <div class="menu-block-wrap">
                                    <div class="text-center mb-4 pb-lg-2" id="textss">
                                    ${emptyFilter(result)}
                                    </div>
                                    ${datasForMenu(result.menuSection)}
                                    <div class="container mt-5">
                        <ul id="data-list" class="list-group mb-4">
                        </ul>
                        <nav>
                            <ul class="pagination justify-content-center" id="pagination">
                            </ul>
                        </nav>
                    </div>
                                </div>
                        </div>`;
    for(product of blockMenu){
        product.innerHTML = menuBlock;
    }
}
function emptyFilter(result){
    let html = `<em class="text-white">${displayCategoryName(result.menuSection)}</em>
                                        <h4 class="text-white">${displayCategoryTitle(result.menuSection)}</h4>`;
    if(filtered.length === 0){
        return;
    }
    return html;
}
//funkcija za ispis opisa kategorije
function displayCategoryName(category){
    for(products in category){
        let product = category[products];
        return `${product.category}`;
    }
}

//funkcija za ispis naziva kategorije
function displayCategoryTitle(categoryTitle){
    for(products in categoryTitle){
        let product = categoryTitle[products];
        return `${product.title}`;
    }
}

//funkcija za ispis value-a name menija
function showMenuName(item){
        let i = "";
        if(item.badge != null){
            i+= `${item.name} <span class="badge ms-3">${item.badge}</span>`
            return i;
        }
        return item.name;
}

//funkcija za ispis value-a cene menija
function showMenuDeletedPrice(item){
    var text = "";
       if(item.pricing.discountPrice != null && item.pricing.discountPercentage != 0){
        text+= `<strong class="text-white ms-auto mt-1"><del>${item.pricing.currency}${item.pricing.originalPrice.toFixed(2)}</del></strong>
        <strong class="ms-2 mt-1">${item.pricing.currency}${item.pricing.discountPrice.toFixed(2)}</strong><span class="badge ms-3 mb-2 mt-2">-${item.pricing.discountPercentage}%</span>`;
        return text;
       }
       text = "";
       text += `<strong class="ms-auto">${item.pricing.currency}${item.pricing.originalPrice.toFixed(2)}</strong>`
       return text;
}

//funkcija za ispis producta unutar menija
function datasForMenu(resultSection) {
    let datas = "";
    let allItems = [];
    resultSection.forEach(section => {
        // Only add items if the category has any
        if (section.items && section.items.length > 0) {
            allItems = allItems.concat(section.items);
        }
    });
    if(allItems.length === 0){
        datas = `<p class="text-muted">There are currently no products.</p>`;
    }
    else{
    let startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    let endIndex = startIndex + PRODUCTS_PER_PAGE;
    let pageProducts = allItems.slice(startIndex, endIndex);
    for (let item of pageProducts) {
        
            datas += `
            <div class="menu-block">
                <div class="d-flex align-items-center my-3">
                    <div class="menu-image-container me-3">
                        <img src="${item.image.url}" alt="${item.image.alt}" class="img-fluid rounded" style="width: 100px; height: 100px; object-fit: cover;">
                    </div>

                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="pt-2 mb-0">
                                ${showMenuName(item)}
                            </h6>
                            <span class="underline flex-grow-1 mx-2"></span>
                            ${showMenuDeletedPrice(item)}
                        </div>

                        <div class="border-top mt-3 pt-3">
                            <small class="text-muted">${item.description}</small>
                        </div>
                        <div><button data-id="${item.id}" class="btn btn-success add-to-cart-btn">Add to Cart</button></div>
                    </div>
                </div>
            </div>`;
        
    }
    if(filtered.length === 0){
        datas = `<p class="text-muted">There are currently no products.</p>`;
    }
}
    return datas;
}
//filtriranje i sortiranje

function showDatas(result) { 
    
    menuData = result;

    // Get DOM elements
    var searchText = document.getElementById("search");
    var filterDDL = document.getElementById("categories");
    var range = document.getElementById("rnPrice");
    var sortList = document.getElementById("sorting");
    // Build categories checkboxes
    var categories = [];
    var filterDDLoptions = "";
    for (let i in result.menuSection) {
        let one = result.menuSection[i];
        categories[i] = one.category;
    }
    for (let i in categories) {
        let cat = categories[i];
        filterDDLoptions += `<input type="checkbox" id="chbox${i}" name="${trimString(cat)}"/> <label for="chbox${i}">${cat}</label></br>`;
    }
    filterDDL.innerHTML = filterDDLoptions;

    // Add event listeners
    searchText.addEventListener("keyup", applyFilters);
    range.addEventListener("change", applyFilters);
    for (let i in categories) {
        let checkbox = document.getElementById(`chbox${i}`);
        checkbox.addEventListener("change", applyFilters);
    }
    sortList.addEventListener("change", applyFilters);
    $(document).on("click", ".btn-page", function(e){
        e.preventDefault();
        currentPage = parseInt($(this).data("page"));
        showMenu({ menuSection: filtered });
        renderPagination();
    })
    // Initial display
    currentPage = 1;
    applyFilters();

    // -----------------------
    // Main filter function
    // -----------------------
    function applyFilters() {
    const userInput = searchText.value.toLowerCase().trim();
    const chosenPrice = Number(range.value);
    const sortValue = sortList.value;
    
    document.getElementById("val").innerHTML = chosenPrice;

    const selectedCategories = Array.from(document.querySelectorAll("#categories input:checked"))
                                    .map(box => box.name);

    const isGlobalSort = ["name-asc", "name-desc", "price-asc", "price-desc"].includes(sortValue);

    // 1. Filter the data as usual
    filtered = menuData.menuSection
        .map(section => {
            const isCategorySelected = selectedCategories.length === 0 || selectedCategories.includes(trimString(section.category));
            if (!isCategorySelected) return { ...section, items: [] };

            const filteredItems = section.items.filter(item => {
                const matchSearch = item.name.toLowerCase().includes(userInput);
                const matchPrice = item.pricing.originalPrice <= chosenPrice;
                return matchSearch && matchPrice;
            });

            return { ...section, items: filteredItems };
        })
        .filter(section => section.items.length > 0);

    // 2. Handle Global Sort if needed
    if (isGlobalSort && filtered.length > 0) {
        let allItems = filtered.flatMap(section => section.items);
        
        if (sortValue === "name-asc") allItems.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortValue === "name-desc") allItems.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortValue === "price-asc") allItems.sort((a, b) => a.pricing.originalPrice - b.pricing.originalPrice);
        else if (sortValue === "price-desc") allItems.sort((a, b) => b.pricing.originalPrice - a.pricing.originalPrice);

        filtered = [{ category: "Search Results", items: allItems }];
    }
    // 4. Final Output
    const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
    if(currentPage > totalPages){
        currentPage = totalPages;
    }
    showMenu({ menuSection: filtered });
    renderPagination();
}
}
//funkcija za sortDDL
function sortDDL(result){
    let sorting = document.getElementById("sorting");
    var tekst = "";
    tekst += "<option value='sortBy'>name or price</option>";
    for(r in result)
        {
            tekst += `<option value="${result[r].nameDDL}">${result[r].valueDDL}</option>`;
        }
        sorting.innerHTML = tekst;
        
}

//paginacija
function renderPagination(){
    let pagination = document.getElementById("pagination");
    let totalItems = 0;
    filtered.forEach(section => {
        totalItems += section.items.length;
    });
    let totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);
    if(totalPages <= 0){
        pagination.innerHTML = "";
        return;
    }
    let html = "";
    for(let i = 1; i <= totalPages; i++){
        html += `<li class="page-item ${i === currentPage ? "active" : ""}"><button class="page-link btn-page" data-page="${i}">${i}</button></li>`;
    }
    pagination.innerHTML = html;
}
}

//funkcija za uklanjanje razmaka u stringu
function trimString(str){
    let res = str.split(" ").join("");
    return res;
}

//obrada gresaka za kontakt
    
    let form = document.querySelector(".forma");
    let formBtn = document.querySelector(".formBtn");
    let errorsBlock = document.querySelector(".errors");
    formBtn.addEventListener("click", function(e){
    e.preventDefault();
    let errors = [];
    let html = "";
     errorsBlock.innerHTML = "";
    let nameInput = document.getElementById("name").value;
    let emailInput = document.getElementById("email").value;
    let messageInput = document.getElementById("message").value;
    let checkUpdatesBox = document.getElementById("updates").checked;
    let contactDDl = document.getElementById("helpType").value;
    let regExName = /^[A-ZČĆŠĐŽ][a-zčćšđž]{2,14}$/;
    let regExEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(nameInput.length === 0){
        errors.push("You must enter a name.");
    }
    if(emailInput.length === 0){
    errors.push("You must enter email.");    
    }
    if(!regExName.test(nameInput)){
        errors.push("Name must be in the range of 2 to 14 characters.");
    }
    if(!regExEmail.test(emailInput)){
        errors.push("Email is in bad format. example (example@gmail.com)");
    }
    if(messageInput.length > 100){
        errors.push("Message contains more than 100 characters.");
    }
    if(contactDDl == 0){
        errors.push("You must select option.");
    }
    if(!checkUpdatesBox){
        errors.push("You must check the updates checkbox");
    }
    if(errors.length != 0){
        for(let error of errors){
            html += `<small class="text-muted">${error}</small></br>`;
        }
        errorsBlock.classList.remove("d-none");
        errorsBlock.innerHTML = html;
    }
    else{
    html += `<small class="text-success">Uspesno ste popunili formu.</small></br>`;
    errorsBlock.classList.remove("d-none");
    errorsBlock.innerHTML = html;
    form.reset();
    }
});

//dinamicko ispisivanje ddl za contact formu
function contactForm(result){
    let ddlForma = document.getElementById("contactDDL");
    let html = "";
    html += `<label for="helpType" class="form-label">Nature of Inquiry</label>
                                        <select class="form-select" id="helpType" name="helpType">
                                            <option value="0" disabled selected>Please select the type of help needed...</option>`;
    for(res of result){
        html += `<option value="${res.value}">${res.text}</option>`;
    }
    html += `</select>`;
    ddlForma.innerHTML = html;
}

//cart
function addToCart(productId) {
    // 1. Get current cart from LocalStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // 2. Find if the product already exists in the cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else { 

    let result = filtered
  .map(section => ({
    item: section.items.find(i => i.id === productId)
  }))
  .find(x => x.item);
        if (result) {
            cart.push({ ...result, quantity: 1 });
            console.log("Added to cart:", result.item.name);
        } 
        else {
            console.error("Could not find product with ID:", productId);
        }
    }

    // 3. Save back to LocalStorage
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    // 4. Update the UI (Optional: trigger a re-render or notification)
    updateCartUI();
}
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-count-badge').text(totalItems);
}

// This listens to the body but only fires if an .add-to-cart-btn is clicked
$('body').on('click', '.add-to-cart-btn', function() {
    const id = $(this).data('id');
    console.log(id)
    addToCart(id);
});

function renderCart() {
    // 1. Get the data
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let cartList = document.querySelector("#tt");
    console.log(cartList)
    let totalPrice = 0;
    let fullPrice = 0;
    // 2. Clear the current display so we don't double up

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
        return;
    }

    // 3. Loop through items and build the HTML
    cart.forEach(item => {
        totalPrice = item.item.pricing.originalPrice * item.quantity;
        fullPrice+=totalPrice;
        let itemHTML = `<thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
            </tr>
        </thead>
        <tbody id="cart-table-body">`;
        cart.forEach(item => {
        let totalPrice = item.item.pricing.originalPrice * item.quantity;
        fullPrice += totalPrice;

        itemHTML += `
        <tr data-price="${item.item.pricing.originalPrice}">
            <td>${item.item.name}</td>
            <td>${item.item.pricing.originalPrice.toFixed(2)}$</td>
            <td>${item.quantity}</td>
            <td>${totalPrice.toFixed(2)}$</td>
            <td><button class="remove-item" onclick="removeItem(this)">×</button></td>
        </tr>`;
    });
        itemHTML += `</tbody><div class="cart-footer">
        <div class="total-price">Final Price: <span id="grand-total">${fullPrice.toFixed(2)}</span>$</div>
    </div>`;
        tt.innerHTML = itemHTML;

        cartList.innerHTML = itemHTML;
    });

}
function removeItem(button) {
        // Briše red u kojem se nalazi pritisnuto dugme
        if(confirm("Are you sure you want to remove this product?")) {
            button.closest('tr').remove();
        }
    }

    function clearCart() {
        // Briše sav sadržaj iz tabele
        if(confirm("Do you want to empty the entire basket??")) {
            document.getElementById('cart-table-body').innerHTML = '';
            localStorage.removeItem("shoppingCart");
        }
    }