import { settings, select, classNames, templates } from "../settings.js";
import utils from "../utils.js";
import CartProduct from "./CartProduct.js";

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    console.log("new Cart", thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.form.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.form.querySelector(select.cart.address);
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
      select.cart.productList
    );
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(
      select.cart.totalNumber
    );
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(
      select.cart.totalPrice
    );
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(
      select.cart.subtotalPrice
    );
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(
      select.cart.deliveryFee
    );
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener("click", function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener("updated", function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener("remove", function (event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener("submit", function (event) {
      event.preventDefault(); // Zablokowanie domyślnego zachowania formularza
      thisCart.sendOrder(); // Wywołanie metody sendOrder
    });
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + "/" + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }

  add(menuProduct) {
    const thisCart = this;

    // Generate HTML for the product
    const generatedHTML = templates.cartProduct(menuProduct);

    // Convert HTML to DOM element
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    // Add the DOM element to the product list in the cart
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    console.log("thisCart.products", thisCart.products);
    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (const product of thisCart.products) {
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price * product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + (thisCart.deliveryFee || 0);

    thisCart.dom.totalNumber.textContent = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.textContent = thisCart.subtotalPrice;
    thisCart.dom.totalPrice.forEach((element) => {
      element.textContent = thisCart.totalPrice;
    });
    thisCart.dom.deliveryFee.textContent = thisCart.deliveryFee || 20;
  }

  remove(cartProduct) {
    const thisCart = this;

    // Remove the cart product from the DOM
    cartProduct.dom.wrapper.remove();

    // Find the index of the cart product in the products array
    const productIndex = thisCart.products.indexOf(cartProduct);

    // Remove the cart product from the products array
    if (productIndex !== -1) {
      thisCart.products.splice(productIndex, 1);
    }

    // Update the cart totals
    thisCart.update();
  }
}

export default Cart;
