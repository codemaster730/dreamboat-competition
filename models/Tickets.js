const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../shared/constants");

// Create Schema
const TicketSchema = new Schema({
    answer: {
      type: String
    },
    answerImageUrl: {
      type: String
    },
    coordX: {
      type: Number
    },
    coordY: {
      type: Number
    },
    boatId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    active:{
      type: Number,
      default: 1,       //  0:deactivated   1:activated   2:deleted
    },
});

module.exports = Ticket = mongoose.model("tickets", TicketSchema);
