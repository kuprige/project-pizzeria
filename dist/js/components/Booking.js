import { select } from "../settings.js";
import AmountWidget from "./AmountWidget.js";

class Booking {
  constructor(element) {
    this.render(element);
    this.initWidgets();
  }

  render(element) {
    this.dom = {};
    this.dom.wrapper = element;
    this.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    this.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    // Rest of the render method...
  }

  initWidgets() {
    this.peopleAmountWidget = new AmountWidget(this.dom.peopleAmount);
    this.hoursAmountWidget = new AmountWidget(this.dom.hoursAmount);

    // Rest of the initWidgets method...
  }

  // Rest of the Booking class...
}

export default Booking;
