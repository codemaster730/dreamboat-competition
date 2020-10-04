const mongoose = require("mongoose");
const constant = require("../shared/constants");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    role: {
      type: String,
      required: false,
      default: constant['ROLE']['EMPLOYEE']
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    phone2: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: false
    },
    date: {
      type: Date,
      default: Date.now
    },
    active:{
      type: Boolean,
      default: false,
    }
});

module.exports = User = mongoose.model("users", UserSchema);
