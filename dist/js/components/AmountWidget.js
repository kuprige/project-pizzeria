import { settings, select } from "../settings.js";

class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.setValue(settings.amountWidget.defaultValue);
    thisWidget.initActions();

    console.log("AmountWidget:", thisWidget);
    console.log("constructor arguments:", element);
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

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    if (!isNaN(newValue) && newValue >= 0 && newValue <= 10) {
      thisWidget.value = newValue;
    } else {
      thisWidget.input.value = thisWidget.value;
    }

    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener("change", function () {
      thisWidget.setValue(thisWidget.input.value);
    });

    thisWidget.linkDecrease.addEventListener("click", function (event) {
      event.preventDefault();
      const newValue = thisWidget.value - 1;
      if (newValue >= 0) {
        thisWidget.setValue(newValue);
      }
    });

    thisWidget.linkIncrease.addEventListener("click", function (event) {
      event.preventDefault();
      const newValue = thisWidget.value + 1;
      if (newValue <= 10) {
        thisWidget.setValue(newValue);
      }
    });
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent("updated", { bubbles: true });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;
