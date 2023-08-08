import { settings, select, classNames, templates } from "./settings.js";
import Product from "./components/Product.js";
import Cart from "./components/Cart.js";
import Booking from "./components/Booking.js";

const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace("#/", "");
    let pageMatchingHash = false;

    for (const page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = true;
        thisApp.activatePage(idFromHash);
        break;
      }
    }

    if (!pageMatchingHash) {
      thisApp.activatePage(thisApp.pages[0].id);
    }

    for (const link of thisApp.navLinks) {
      link.addEventListener("click", function (event) {
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href attribute*/
        const id = clickedElement.getAttribute("href").replace("#", "");

        /* run thisApp.activatePage with that id*/
        thisApp.activatePage(id);

        /*change URl hash */
        window.location.hash = "#" + id;
      });
    }
  },
  activatePage: function (pageId) {
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    for (const page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class "active" to matching links, remove from non-matching */
    for (const link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute("href") == "#" + pageId
      );
    }
  },

  init: function () {
    const thisApp = this;
    console.log("*** App starting ***");
    console.log("thisApp:", thisApp);
    console.log("classNames:", classNames);
    console.log("settings:", settings);
    console.log("templates:", templates);

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },

  initMenu: function () {
    const thisApp = this;
    console.log("thisApp.data:", thisApp.data);

    for (const productId in thisApp.data.products) {
      if (thisApp.data.products.hasOwnProperty(productId)) {
        new Product(productId, thisApp.data.products[productId]);
      }
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
  initBooking: function () {
    const thisApp = this;

    // Znajdujemy kontener widgetu do rezerwacji stron
    const bookingWidgetContainer = document.querySelector(
      select.containerOf.booking
    );

    // Tworzymy nową instancję klasy Booking i przekazujemy do konstruktora znaleziony kontener
    thisApp.booking = new Booking(bookingWidgetContainer);
  },
};

app.init();
