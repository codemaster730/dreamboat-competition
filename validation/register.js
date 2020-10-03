const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.email2 = !isEmpty(data.email2) ? data.email2 : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.phone2 = !isEmpty(data.phone2) ? data.phone2 : "";
  data.termcheck = !isEmpty(data.termcheck) ? data.termcheck : "";
// First Name checks
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First Name field is required";
  }
// Second Name checks
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last Name field is required";
  }
// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email2)) {
    errors.email2 = "Confirm Email field is required";
  } else if (!Validator.isEmail(data.email2)) {
    errors.email2 = "Confirm Email is invalid";
  }
// Phone checks
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone field is required";
  } else if (!Validator.isNumeric(data.phone)) {
    errors.phone = "Phone field should be digits";
  }
  if (Validator.isEmpty(data.phone2)) {
    errors.phone2 = "Secondary Phone field is required";
  } else if (!Validator.isNumeric(data.phone2)) {
    errors.phone2 = "Secondary Phone field should be";
  }
// Agree Terms Check
  if (Validator.isEmpty(data.termcheck)) {
    errors.termcheck = "Agree to the terms and conditions";
  }
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};