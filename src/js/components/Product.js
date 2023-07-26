import { select, classNames, templates } from "../settings.js";
import utils from "../utils.js";
import AmountWidget from "./AmountWidget.js";

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

    thisProduct.amountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
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
    console.log("initOrderForm");

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
      thisProduct.addToCart();
    });
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener("updated", function () {
      thisProduct.processOrder();
    });

    thisProduct.amountWidget.setValue(1);
  }

  processOrder() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);

    let totalPrice = thisProduct.data.price;

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected =
          formData.hasOwnProperty(paramId) &&
          formData[paramId].includes(optionId);

        if (optionSelected && !option.default) {
          totalPrice += option.price;
        } else if (!optionSelected && option.default) {
          totalPrice -= option.price;
        }

        const optionImage = thisProduct.imageWrapper.querySelector(
          `.${paramId}-${optionId}`
        );
        if (optionImage) {
          if (optionSelected) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          } else {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    totalPrice *= thisProduct.amountWidget.value;
    thisProduct.totalPrice = totalPrice;

    thisProduct.priceElem.innerHTML = totalPrice;
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      price: thisProduct.totalPrice,
      priceSingle: thisProduct.data.price,
      amount: thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams(),
    };

    return productSummary;
  }

  addToCart() {
    const thisProduct = this;
    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent("add-to-cart", {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
  prepareCartProductParams() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);

    const params = {};

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      params[paramId] = {
        label: param.label,
        options: {},
      };

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected =
          formData.hasOwnProperty(paramId) &&
          formData[paramId].includes(optionId);

        if (optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }

    return params;
  }
}

export default Product;
