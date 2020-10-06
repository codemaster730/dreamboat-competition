const express = require("express");
const router = express.Router();

// Load CartItem model
const Ticket = require("../../models/CartItem");
const Boat = require("../../models/Boat");
const User = require("../../models/User");
const constant = require("../../shared/constants");


// @route POST api/ticketadmin/ticketlist
// @desc Get tickets
// @access Public
router.post("/ticketlist", (req, res) => {
    Ticket
    .find({
    })
    .populate('boatId userId')
    .then(tickets => {
        if (!tickets) {
            tickets = [];
        }
        console.log(tickets[0].boatId);
        return res.json({
            success: true,
            tickets: tickets
        });
    })
    .catch(err => console.log(err));
});

// @route POST api/ticketadmin/ticket
// @desc Update Ticket
// @access Public
router.put("/ticket/:ticketId", (req, res) => {
    // Validate Request
    if(!req.body.ticket) {
        return res.status(400).send({
            message: "Ticket detail can not be empty"
        });
    }
    // Find ticket and update it with the request body
    Ticket.findByIdAndUpdate(req.params.ticketId, req.body.ticket, {new: true})
    .then(ticket => {
        if(!ticket) {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });
        }
        res.send(ticket);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "ticket not found with id " + req.params.ticketId
            });                
        }
        return res.status(500).send({
            message: "Error updating ticket with id " + req.params.ticketId
        });
    });
});

// @route DELETE api/ticketadmin/ticket/:id
// @desc Delete ticket
// @access Public
router.delete("/ticket/:ticketId", (req, res) => {
    
    Ticket.findByIdAndRemove(req.params.ticketId)
    .then(ticket => {
        if(!ticket) {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });
        }
        res.status(200).send({message: "Ticket deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });                
        }
        return res.status(500).send({
            message: "Could not delete ticket with id " + req.params.ticketId
        });
    });
  
  });

module.exports = router;
