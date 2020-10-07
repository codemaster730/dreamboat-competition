const express = require("express");
var mongoose = require('mongoose');
const router = express.Router();

const _ = require('lodash');

// Load CartItem model
const CartItem = require("../../models/CartItem");
const Boat = require("../../models/Boat");
const e = require("express");
const { findIndex } = require("lodash");

// @route POST api/carts/addTickets
// @desc Add Cart Items
// @access Public
router.post("/addCartTickets", (req, res) => {
  
  let item = req.body;
  item.boatId = mongoose.Types.ObjectId(item.boatId);
  item.userId = mongoose.Types.ObjectId(item.userId);
  if (item.ticketsAdded === 0)
    return res.status(404).json({message: "No Items Found"});
  Boat.findById(item.boatId).then((boat) => {
    if(!boat) {
      return res.status(404).send({
          message: "Note boat found with id " + item.boatId
      });
    }
    CartItem.findOne({boatId: item.boatId}).then(cartItem => {

      let newTickets = [];
      for(let i = 0; i < item.ticketsAdded; i++) {
        newTickets.push({answer: '', answerImageUrl: '', coordX: null, coordY: null});
      }
      if (!cartItem) {
        const itemData = {
          category: boat.category,
          manufacturer: boat.manufacturer,
          model: boat.model,
          prizePrice: boat.prizePrice,
          currency: boat.currency,
          thumnailUri: boat.images[0],
          ticketPrice: boat.ticketPrice,
          ticketCount: item.ticketsAdded,
          boatId: item.boatId,
          userId: mongoose.Types.ObjectId(item.userId),
          tickets: newTickets
        };
        cartItem = new CartItem(itemData);
      } else {
        cartItem.ticketCount = cartItem.ticketCount + item.ticketsAdded;
        cartItem.tickets = cartItem.tickets.concat(newTickets);
      }
      cartItem
      .save()
      .then((item) => {
        CartItem.find({userId: item.userId}).then((items) => {
          return res.status(200).json({items: items, message: "Successfully added tickets."});
        }).catch((err) => {
          return res.status(500).json({message: "Error occured while adding Tickets."});
        });
      }).catch(err => {
        return res.status(500).json({message: "Error occured while adding Tickets."});
      });
    });
  }).catch((err) => {
    return res.status(500).json({message: "Error occured while finding boat"});
  });

});

// @route POST api/carts/getTickets
// @desc Load Cart Items  
// @access Public
router.post("/getCartTickets", (req, res) => {
  if (req.body.userId) {
    
    CartItem.find({userId: mongoose.Types.ObjectId(req.body.userId) }).then(items => {
      if (items) {
        return res.status(200).json(items);
      } else {
        return res.status(400).json({message: "Couldn't find cart items due to server issue"});
      }
    });
  } else {
    return res.status(400).json({message: "Couldn't find cart items for this user"});
  }
});

// @route POST api/carts/setBatchTickets
// @desc Set all tickets to defined position(x,y)  and Return CartItems data
// @access Public
router.post("/setBatchTickets", (req, res) => {
  if (req.body.userId) {
    CartItem.find({userId: req.body.userId}).then(items => {
      items.map(cartItem=>{
        cartItem.tickets.map(tickItem=>{
          tickItem.coordX = req.body.coordX;
          tickItem.coordY = req.body.coordY;
        });
        cartItem
          .save()
          .then((item) => {
            console.log("Successfully updated a ticket");
          }).catch((err) => {
            return res.status(500).json({message: "Error occured while updating a ticket."});
          });
      });
      
      if (items) {
        return res.status(200).json(items);
      } else {
        return res.status(400).json({message: "Couldn't find cart items due to server issue"});
      }
    });
  } else {
    return res.status(400).json({message: "Couldn't find cart items for this user"});
  }
});

// @route POST api/carts/addCartTicket
// @desc Add a single ticket
// @access Public
router.post("/addCartTicket", (req, res) => {
  CartItem.findById(req.body.cartItemId).then(cartItem => {
    if (cartItem) {
      cartItem.tickets.push(req.body.ticket);
      cartItem.ticketCount += 1;
      cartItem
      .save()
      .then((item) => {
        return res.status(200).json({message: "Successfully added a ticket", newId: cartItem.tickets[cartItem.ticketCount-1].id });
      }).catch((err) => {
        return res.status(500).json({message: "Error occured while adding a ticket."});
      });
    } else {
      return res.status(404).send({
        message: "Cart Item not found with id " + req.body.cartItemId
      });
    }
  });
});

// @route POST api/carts/removeCartTicket
// @desc Remove a single ticket
// @access Public
router.post("/removeCartTicket", (req, res) => {
    CartItem.findById(req.body.cartItemId).then(cartItem => {
      if (cartItem) {        
        if (req.body.ticketId===undefined) {
          cartItem.tickets.pop();
        } else {
          let tickets = cartItem.tickets;
        console.log(tickets);
          const index = tickets.findIndex((ticket) => ticket.id === req.body.ticketId);
          console.log(req.body.ticketId,"-",index);
          tickets.splice(index, 1);
          cartItem.tickets = tickets;
        }
        cartItem.ticketCount -= 1;
        cartItem
        .save()
        .then((item) => {
          return res.status(200).json({message: "Successfully removed a ticket"});
        }).catch((err) => {
          return res.status(500).json({message: "Error occured while removing a ticket."});
        });
      } else {
        return res.status(404).send({
          message: "Cart Item not found with id " + req.body.cartItemId
        });
      }
    });
  });

// @route POST api/carts/updateCartTicket
// @desc Update a single ticket
// @access Public

router.post("/updateCartTicket", (req, res) => {
  CartItem.findById(req.body.cartItemId).then(cartItem => {
    if (cartItem) {
      let tickets = cartItem.tickets;
      const index = tickets.findIndex((ticket) => ticket.id == req.body.ticket._id);
      tickets.splice(index, 1, req.body.ticket);
      cartItem.tickets = tickets;
      cartItem
      .save()
      .then((item) => {
        console.log("Successfully updated a ticket");
        return res.status(200).json({message: "Successfully updated a ticket"});
      }).catch((err) => {
        return res.status(500).json({message: "Error occured while updating a ticket."});
      });
    } else {
      return res.status(404).send({
        message: "Cart Item not found with id " + req.body.cartItemId
      });
    }
  });
});

// @route POST api/carts/removeCartItem
// @desc Remove a single cart item
// @access Public
router.post("/removeCartItem", (req, res) => {
  CartItem.findByIdAndRemove(req.body.cartItemId)
    .then((cartItem) => {
      if(!cartItem) {
        return res.status(404).send({
            message: "Cart Item not found with id " + req.body.cartItemId
        });
      }
      res.send({message: "Cart Item deleted successfully!"});
    }).catch((err) => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
            message: "Cart Item not found with id " + req.body.cartItemId
        });                
      }
      return res.status(500).send({
          message: "Could not delete cart item with id " + req.body.cartItemId
      });
    });
});

// @route GET api/carts/getCartTotal
// @desc Get Cart Total Count
// @access Public

router.post("/getCartTotal", (req, res) => {
  CartItem.find({userId: req.body.userId}).then((items) => {
    let totalCount = 0;
    items.forEach(item => {
      totalCount += item.ticketCount;
    });
    return res.status(200).json({totalTicketCount: totalCount, message: "Success"});
  }).catch((err) => {
    return res.status(500).json({message: "Error occured while getting count."});
  });
});


module.exports = router;