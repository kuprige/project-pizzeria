/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  ("use strict");

  const select = {
    templateOf: {
      menuProduct: "#template-menu-product",
    },
    containerOf: {
      menu: "#product-list",
      cart: "#cart",
    },
    all: {
      menuProducts: "#product-list > .product",
      menuProductsActive: "#product-list > .product.active",
      formInputs: "input, select",
    },
    menuProduct: {
      clickable: ".product__header",
      form: ".product__order",
      priceElem: ".product__total-price .price",
      imageWrapper: ".product__images",
      amountWidget: ".widget-amount",
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: "active",
      imageVisible: "active",
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    ),
  };

  let activeProduct;

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();

      console.log("new Product:", thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;

      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(
        select.menuProduct.clickable
      );
      thisProduct.form = thisProduct.element.querySelector(
        select.menuProduct.form
      );
      thisProduct.formInputs = thisProduct.form.querySelectorAll(
        select.all.formInputs
      );
      thisProduct.cartButton = thisProduct.element.querySelector(
        select.menuProduct.cartButton
      );
      thisProduct.priceElem = thisProduct.element.querySelector(
        select.menuProduct.priceElem
      );
      thisProduct.imageWrapper = thisProduct.element.querySelector(
        select.menuProduct.imageWrapper
      );
    }

    initAccordion() {
      const thisProduct = this;

      thisProduct.accordionTrigger.addEventListener("click", function () {
        if (activeProduct && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
        thisProduct.element.classList.toggle(
          classNames.menuProduct.wrapperActive
        );
        activeProduct = thisProduct.element;
      });
    }
    initOrderForm() {
      const thisProduct = this;

      console.log("initOrderForm");

      thisProduct.form.addEventListener("submit", function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener("change", function () {
          thisProduct.processOrder();
        });

        thisProduct.form.addEventListener("submit", function (event) {
          event.preventDefault();
          thisProduct.processOrder();
        });

        for (let input of thisProduct.formInputs) {
          input.addEventListener("change", function () {
            thisProduct.processOrder();
          });
        }

        thisProduct.cartButton.addEventListener("click", function (event) {
          event.preventDefault();
          thisProduct.processOrder();
        });
      }
    }
    processOrder() {
      const formData = utils.serializeFormToObject(this.form);
      this.params = {};
      let price = this.data.price;

      for (let paramId in this.data.params) {
        const param = this.data.params[paramId];

        for (let optionId in param.options) {
          const option = param.options[optionId];

          const optionSelected =
            formData[paramId] && formData[paramId].includes(optionId);
          const optionImage = this.imageWrapper.querySelector(
            `.${classNames.menuProduct.imageWrapper} .${paramId}-${optionId}`
          );

          if (optionSelected) {
            if (!option.default) {
              price += option.price;
            }

            if (!this.params[paramId]) {
              this.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            this.params[paramId].options[optionId] = option.label;

            if (optionImage) {
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            }
          } else {
            if (optionImage) {
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }

      this.priceSingle = price;
      this.price = this.priceSingle * this.amountWidget.value;
      this.priceElem.innerHTML = this.price;

      const productPriceElem = this.form.querySelector(".price");
      productPriceElem.innerHTML = this.price;

      const productParamsElem = this.form.querySelector(".params");
      productParamsElem.innerHTML = JSON.stringify(this.params);
    }
  }

  const app = {
    init: function () {
      const thisApp = this;
      console.log("*** App starting ***");
      console.log("thisApp:", thisApp);
      console.log("classNames:", classNames);
      console.log("settings:", settings);
      console.log("templates:", templates);

      thisApp.initData();
      thisApp.initMenu();
    },

    initMenu: function () {
      const thisApp = this;
      console.log("thisApp.data:", thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },
  };

  app.init();
}
