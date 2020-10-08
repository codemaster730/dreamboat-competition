const express = require("express");
const router = express.Router();

// Load CartItem model
//const Ticket = require("../../models/CartItem");
const Ticket = require("../../models/Candidate");

const Boat = require("../../models/Boat");
const User = require("../../models/User");
const SpotBall = require("../../models/SpotBall");
const constant = require("../../shared/constants");


// @route POST api/ticketadmin/ticketlist
// @desc Get tickets
// @access Public
router.post("/ticketlist", (req, res) => {
    
    Ticket.aggregate(
      [
        {
            $lookup: {
                from : "users",
                localField : "userId",
                foreignField : "_id",
                as: 'user',
            },
        },
        { "$unwind": "$items" },
        {
            $lookup: {
                from : "boats",
                localField : "items.boatId",
                foreignField : "_id",
                as: 'items.boat',
            },
        },
        { "$unwind": "$items.tickets" },
        {
            $group: {
                _id: {userId:"$userId", boatId:"$items.boatId"},
                user: {"$first":"$user"},
                boat: {"$first":"$items.boat"},
                tickets: {"$push":"$items.tickets"},
            },            
        },
        {
            $group: {
                _id: "$_id.userId",
                user: {"$first":"$user"},
                data: {"$push":{boat:"$boat", tickets:"$tickets"}, },
            },            
        },
      ],
      function (err, tickets) {
        SpotBall.find({active:true})
        .then(spotBall=>{
            if(spotBall.length>0){
                return res.status(200).send({
                    tickets: tickets,
                    spotball: spotBall,
                });
            }
        });
      }
    )
});


// @route DELETE api/ticketadmin/ticket/:id
// @desc Delete ticket
// @access Public
router.delete("/ticket/:ticketId", (req, res) => {
    
    Ticket.deleteMany({userId:req.params.ticketId})
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

// @route GET api/ticketadmin/ticket/clear
// @desc Clear All tickets
// @access Public
router.post("/ticket/clear", (req, res) => {
    Ticket.deleteMany({})
    .then(ticket => {
        if(!ticket) {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });
        }
        res.status(200).send({message: "Ticket cleared successfully!"});
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
