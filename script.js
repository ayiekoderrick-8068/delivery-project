var cart = [];
// Load cart from localStorage
var savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
}
function showMessage(text, isError) {
    var messageBox = document.getElementById('delivery-message');
    messageBox.innerText = text;
    if (isError) {
        messageBox.style.color = 'red';
        messageBox.style.background = '#ffe0e0';
    } else {
        messageBox.style.color = 'green';
        messageBox.style.background = '#e0ffe0';
    }
    messageBox.style.fontWeight = 'bold';
    messageBox.style.marginTop = '10px';
    messageBox.style.padding = '10px';
    messageBox.style.borderRadius = '5px';
}
function updateCart() {
    var cartItems = document.getElementById('cart-items');
    var cartCount = document.getElementById('cart-count');
    var cartTotal = document.getElementById('cart-total');
    var total = 0;
    cartItems.innerHTML = '';
    for (var i = 0; i < cart.length; i++) {
        total += cart[i].price;
        var li = document.createElement('li');
        li.innerHTML = '<span>' + cart[i].name + ' - KSH ' + cart[i].price + '</span>' +
            '<button class="remove-btn" onclick="removeFromCart(' + i + ')">✕</button>';
        cartItems.appendChild(li);
    }
    cartCount.innerText = cart.length;
    cartTotal.innerText = 'Total: KSH ' + total;
}
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    localStorage.setItem('cart', JSON.stringify(cart)); // SAVE
    updateCart();
    showMessage('🛒 ' + name + ' added to cart!');
}
function removeFromCart(index) {
    var removed = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart)); // SAVE
    updateCart();
    showMessage('🗑️ ' + removed.name + ' removed from cart!', true);
}
function placeOrder() {
    if (cart.length === 0) {
        showMessage('❌ Your cart is empty! Please add items first.', true);
        return;
    }
   var orderId = 'ORD-' + Date.now();
    showMessage('✅ Order ' + orderId + ' placed! We will deliver to your doorstep.');
    cart = [];
    localStorage.removeItem('cart'); // DELETE STORAGE
    updateCart();
}
// Order now button
document.querySelector('.hero button').addEventListener('click', function() {
    placeOrder();
});
// Checkout button
document.getElementById('checkout-btn').addEventListener('click', function() {
    placeOrder();
});
// Category buttons (food, grocery, pharmacy, package delivery)
var categoryButtons = document.querySelectorAll('.about ul li button');
for (var i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].addEventListener('click', function(e) {
        var li = e.target.closest('li');
        var name = li.querySelector('span').innerText;
        addToCart(name, 0);
    });
}
// Product add to cart buttons
function attachProductButtons() {
    var productButtons = document.querySelectorAll('.products button');
    for (var j = 0; j < productButtons.length; j++) {
        productButtons[j].addEventListener('click', function(e) {
            var product = e.target.closest('.products');
            var name = product.querySelector('h3').innerText;
            var priceText = product.querySelector('p').innerText;
            var price = parseInt(priceText.match(/\d+/)) || 0;
            addToCart(name, price);
        });
    }
}
function loadProducts() {
    var productsSection = document.getElementById('products');
    productsSection.innerHTML = '<h2>Our Products</h2><p>Loading...</p>';
    fetch('https://dummyjson.com/products/category/groceries')
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            productsSection.innerHTML = '<h2>Our Products</h2>';

            var products = data.products;

            for (var i = 0; i < products.length; i++) {
                var product = products[i];
                var div = document.createElement('div');
                div.className = 'products';
                div.innerHTML =
                    '<img src="' + product.thumbnail + '">' +
                    '<h3>' + product.title + '</h3>' +
                    '<p>KSH ' + Math.round(product.price * 130) + '</p>' +
                    '<button>Add to Cart</button>';
                productsSection.appendChild(div);
            }
            attachProductButtons();
        })
        .catch(function(error) {
            productsSection.innerHTML = '<p>Failed to load products</p>';
            console.log(error);
        });
}
loadProducts();
