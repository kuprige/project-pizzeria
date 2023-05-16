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

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
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

      const clickableTrigger = thisProduct.accordionTrigger;

      clickableTrigger.addEventListener("click", function (event) {
        event.preventDefault();

        thisProduct.element.classList.toggle("active");

        const allActiveProducts = document.querySelectorAll(
          select.all.menuProductsActive
        );

        for (let activeProduct of allActiveProducts) {
          if (activeProduct !== thisProduct.element) {
            activeProduct.classList.remove("active");
          }
        }
      });
    }

    initOrderForm() {
      const thisProduct = this;

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

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener("updated", function () {
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;

      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log("formData", formData);

      let price = thisProduct.data.price * thisProduct.amountWidget.value;

      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        console.log(paramId, param);

        for (let optionId in param.options) {
          const option = param.options[optionId];
          console.log(optionId, option);

          const optionSelected =
            formData.hasOwnProperty(paramId) &&
            formData[paramId].includes(optionId);

          const optionNotSelectedAndDefault = !optionSelected && option.default;
          if (optionSelected && !option.default) {
            price += option.price;
          } else if (optionNotSelectedAndDefault) {
            price -= option.price;
          }

          const optionImage = thisProduct.imageWrapper.querySelector(
            `.${paramId}-${optionId}`
          );
          if (optionImage) {
            if (optionSelected) {
              optionImage.classList.add("active");
            } else {
              optionImage.classList.remove("active");
            }
          }
        }
      }

      thisProduct.priceElem.innerHTML = price;
    }
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(
        select.widgets.amount.input
      );
      thisWidget.linkDecrease = thisWidget.element.querySelector(
        select.widgets.amount.linkDecrease
      );
      thisWidget.linkIncrease = thisWidget.element.querySelector(
        select.widgets.amount.linkIncrease
      );
    }
    announce() {
      const thisWidget = this;

      const event = new Event("updated");
      thisWidget.element.dispatchEvent(event);
    }
    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);

      if (
        newValue >= settings.amountWidget.defaultMin &&
        newValue <= settings.amountWidget.defaultMax
      ) {
        thisWidget.value = newValue;
        thisWidget.input.value = thisWidget.value;
        thisWidget.element.dispatchEvent(new CustomEvent("updated"));
      } else if (newValue < settings.amountWidget.defaultMin) {
        thisWidget.value = settings.amountWidget.defaultMin;
        thisWidget.input.value = thisWidget.value;
      } else {
        thisWidget.value = settings.amountWidget.defaultMax;
        thisWidget.input.value = thisWidget.value;
      }
    }

    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener("change", () => {
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener("click", (event) => {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });

      thisWidget.linkIncrease.addEventListener("click", (event) => {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });

      this.initActions();
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
