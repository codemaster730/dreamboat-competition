const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref:'users'},
  paypalPayerId: {type: String},
  paypalOrderId: {type: String},
  items: [{
    boatId: { 
      type: Schema.Types.ObjectId, 
      ref:'boats' 
    },
    tickets: [{
      coordX: {type: Number},
      coordY: {type: Number}
    }]
  }],
  total: {type: Number, default: 0},
  date: {type: Date,default: Date.now}
});

module.exports = Candidate = mongoose.model("candidates", CandidateSchema);