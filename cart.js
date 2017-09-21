$(function () {
    // Generate random products
    loadProducts();
	$('#checkout_btn').click(e => {
		$('.modal_form').css('display', 'flex');
	});
	$('#close_modal_btn').click(e => {
		$('.modal_form').css('display', 'none');
	});
	$('.modal_form form').submit(e => {
		e.preventDefault();
		$('.modal_form').css('display', 'none');
		$('.order_sent_message').css('display', 'flex');
	});
	$('#reload_page').click(e => {
		window.location = '/';
	});
});

var total = 0,
    subtotal = 0;

const tax = 1.065;

function loadProducts() {
    // Grab the container from the dom
    let $container = $(".products_container");

    // Generate products with random prices
    for (var i = 0; i < 15; i++) {
        let price = Math.floor(Math.random() * 99) + 100;
        $container.append(makeProduct(i, price));
    }
    // Set the listeners for click and hover methods on each product
    setProductListeners();
}

function makeProduct(i, price) {
    // main product container
    let $product = $('<a class="col col-xs-12 col-md-6 col-lg-4 product">');
    // Product content container
    let $product_content_container = $('<div>');
    // product image (based on index passed in)
    let $product_image = $('<img src="https://unsplash.it/300/250/?image=' + i + '">');
    // product title
    let $product_title = $('<h2>Product ' + i + '</h2>');
    // product description
    let $product_description = $('<p>Product ' + i + '</p>');
    // product price (set randomly for now, could be changed to DB prices)
    let $product_price = $('<p class="price">$' + price + '</p>');

    $product_content_container.append($product_image, $product_title, $product_description, $product_price);
    $product.append($product_content_container);

    return $product;
}

function setProductListeners() {
    // These hover features would not work on mobile and would need a different
    // implementation, but I like them and this isn't production, so they stay for
    // now. Show the add to cart button on hover
    $(".product")
        .on("mouseenter", function () {
            $(this).toggleClass("hovered");
        })
    // Hide the button on leave
    $(".product").on("mouseleave", function () {
        $(this).toggleClass("hovered");
    })

    // Click functions for each product
    $('.product').click(function () {
        // Get the random price (again this should be pulled from a DB)
        price = $(this)
            .find(".price:first")
            .text()
            .split("$")[1];

        // Check if the product is in the cart or the main section
        if ($(this).hasClass('carted')) {
            // Remove the price from the total since we are removing product from the cart
            total -= parseInt(price);
            calcSubTotal();
            // Add the mobile classes back
            $(this).addClass('col-lg-4', 'col-md-6');
            $(this)
                .detach()
                .prependTo('.products_container');
            $(this).removeClass('carted');
        } else {
            // Add the price to the total since we are adding product to the cart
            total += parseInt(price);
            calcSubTotal();
            $(this).removeClass('col-lg-4 col-md-6');
            $(this)
                .detach()
                .appendTo('.cart');
            $(this).addClass('carted');
            // My attempt to change the hover text since the product is already in the cart.
            // Didn't work. $(this + ":after").css({"content": 'Remove From Cart'});
        }
    });
}

function calcSubTotal() {
    subtotal = total * tax;
    $('#total').text('$' + total);
    $('#subtotal').text('$' + subtotal);
}
