const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  userId: {type: String},
  paypalPayerId: {type: String},
  paypalOrderId: {type: String},
  tickets: [{
      cartItemId: {type: String},
      boatId: {type: String},
      coordX: {type: Number},
      coordY: {type: Number}
  }],
  total: {type: Number, default: 0},
  date: {type: Date,default: Date.now}
});

module.exports = Candidate = mongoose.model("candidates", CandidateSchema);