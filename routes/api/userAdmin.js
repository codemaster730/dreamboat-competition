const express = require("express");
const router = express.Router();

// Load CartItem model
const User = require("../../models/User");
const constant = require("../../shared/constants");


// @route POST api/useradmin/userlist
// @desc Get users
// @access Public
router.post("/userlist", (req, res) => {
    User
    .find({role:{$ne:'Administrator'}}).sort({date: -1})    //except for 'Administrator', Sort by create date
    .then(users => {
        if (!users) {
            users = [];
        }
        return res.json({
            success: true,
            users: users
        });
    })
    .catch(err => console.log(err));
});

// @route POST api/useradmin/user
// @desc Update User
// @access Public
router.put("/user/:userId", (req, res) => {
    // Validate Request
    if(!req.body.user) {
        return res.status(400).send({
            message: "User detail can not be empty"
        });
    }
    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, req.body.user, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });
});

// @route DELETE api/useradmin/user/:id
// @desc Delete user
// @access Public
router.delete("/user/:userId", (req, res) => {
    
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.status(200).send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
  
  });

module.exports = router;
