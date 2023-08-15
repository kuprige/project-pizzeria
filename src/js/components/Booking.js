import { templates } from "../settings.js";

class Booking {
  constructor(element) {
    const thisBooking = this;

    // Przypisanie referencji do kontenera do właściwości thisBooking.dom.wrapper
    thisBooking.dom = {
      wrapper: element,
    };

    // Wywołanie metody render
    thisBooking.render();

    // Wywołanie metody initWidgets
    thisBooking.initWidgets();
  }

  render() {
    const thisBooking = this;

    // Wygenerowanie kodu HTML za pomocą szablonu templates.bookingWidget
    const generatedHTML = templates.bookingWidget();

    // Utworzenie pustego obiektu thisBooking.dom
    thisBooking.dom = {};

    // Przypisanie referencji do kontenera do właściwości thisBooking.dom.wrapper
    thisBooking.dom.wrapper = document.createElement("div");
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    // Zmiana zawartości kontenera na wygenerowany kod HTML
    thisBooking.dom.wrapper.innerHTML = generatedHTML; // Poprawiono to przypisanie
  }

  initWidgets() {
    // Tu zostanie zaimplementowana logika inicjalizacji interaktywnych widgetów
  }
}

export default Booking;
