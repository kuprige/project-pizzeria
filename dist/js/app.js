import { settings, select, classNames, templates } from "./settings.js";
import Product from "./components/Product.js";
import Cart from "./components/Cart.js";

const app = {
  init: function () {
    const thisApp = this;
    console.log("*** App starting ***");
    console.log("thisApp:", thisApp);
    console.log("classNames:", classNames);
    console.log("settings:", settings);
    console.log("templates:", templates);

    thisApp.initData();
    thisApp.initCart();
  },

  initMenu: function () {
    const thisApp = this;
    console.log("thisApp.data:", thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + "/" + settings.db.products;

    fetch(url)
      .then(function (response) {
        return response.json(); // Parsowanie odpowiedzi jako JSON
      })
      .then(function (parsedResponse) {
        console.log(parsedResponse); // Wyświetlanie sparsowanej odpowiedzi w konsoli
        thisApp.data.products = parsedResponse; // Przypisanie sparsowanej odpowiedzi do thisApp.data.products

        // Wywołanie metody initMenu po otrzymaniu odpowiedzi z serwera
        thisApp.initMenu();
      });
  },

  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    const productList = document.querySelector(select.containerOf.menu);
    productList.addEventListener("add-to-cart", function (event) {
      thisApp.cart.add(event.detail.product.prepareCartProduct());
    });
  },
};

app.init();
