const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const BoatSchema = new Schema({
    category: {
      type: String,
      required: true
    },
    manufacturer: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    prizePrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    length: {
      type: String,
      required: false
    },
    width: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: true
    },
    ticketPrice: {
      type: Number,
      required: true
    },
    images: [{
      type: String
    }]

});

module.exports = Boat = mongoose.model("boats", BoatSchema);
