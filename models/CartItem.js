const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../shared/constants");

// Create Schema
const CartItemSchema = new Schema({
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
    thumnailUri: {
      type: String,
      required: false
    },
    currency: {
      type: String,
      required: true
    },
    ticketCount: {
      type: Number,
      required: true
    },
    ticketPrice: {
      type: Number,
      required: true
    },
    tickets: [
      {
        ticketId: Schema.Types.ObjectId,
        answer: {type: String},
        answerImageUrl: {type: String},
        coordX: {type: Number},
        coordY: {type: Number}
      }
    ],
    boatId: { 
      type: Schema.Types.ObjectId, 
      ref:'boats' 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref:'users' 
    },
});

module.exports = CartItem = mongoose.model("cartItems", CartItemSchema);
