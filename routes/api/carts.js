const express = require("express");
const router = express.Router();

// Load CartItem model
const CartItem = require("../../models/CartItem");
const User = require("../../models/User");

// @route POST api/carts/addItems
// @desc Add Cart Items
// @access Public
router.post("/addItems", (req, res) => {
  
  let cartItems = req.body;
  let total = cartItems.length;
  if (total === 0)
    return res.status(404).json({success: "No Items Found"});

  cartItems.forEach(cartItem => {
    CartItem.findOne({boatId: cartItem.boatId}).then(item => {
      if (!item) {
        item = new CartItem(cartItem);
      } else {
        item.ticketNumber = cartItem.ticketNumber;
      }
      item
        .save()
        .then(item => {
          total--;
          if (total === 0) {
            CartItem.find({}).then(items => {
              return res.status(200).json(items);
            }).catch(err => {
              console.log(err);
            });
          }
        }).catch(err => {
          console.log(err);
        });
    });
  });

});

// @route POST api/carts/loadItems
// @desc Load Cart Items
// @access Public
router.post("/loadItems", (req, res) => {
  if (req.body.userId) {
    CartItem.find({userId: req.body.userId}).then(items => {
      if (items) {
        return res.status(200).json(items);
      } else {
        return res.status(400).json({error: "Couldn't find cart items due to server issue"});
      }
    });
  } else {
    return res.status(400).json({error: "Couldn't find cart items for this user"});
  }
});

module.exports = router;