const express = require("express");
const router = express.Router();

// Load Candidate model
const Candidate = require("../../models/Candidate");

// @route POST api/candidates
// @desc Add Candidate
// @access Public
router.post("/", (req, res) => {
    // Validate request
    if(!req.body.candidate) {
        return res.status(400).send({
            message: "Candidate content can not be empty"
        });
    }
    const candidate = new Candidate(req.body.candidate);
    // Save expense in the database
    candidate.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Candidate."
        });
    });
});


module.exports = router;


