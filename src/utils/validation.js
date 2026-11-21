import { DELIVERY_AREAS } from '../rules/orderRules.js';

// Checks the checkout form. Returns an object like { phone: 'message' }.
// An empty object means the form is valid.
export function validateCheckout(form) {
  const errors = {};

  if (form.name.trim().length < 3) {
    errors.name = 'Enter your name (at least 3 letters).';
  }

  // Pakistani mobile number: 11 digits starting with 03, e.g. 03001234567
  if (!/^03\d{9}$/.test(form.phone.trim())) {
    errors.phone = 'Enter an 11-digit mobile number starting with 03, e.g. 03001234567.';
  }

  if (!DELIVERY_AREAS.includes(form.area)) {
    errors.area = 'Choose a delivery area from the list.';
  }

  if (form.address.trim().length < 10) {
    errors.address = 'Enter your hostel or house address (at least 10 characters).';
  }

  return errors;
}
