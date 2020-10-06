const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// Load spotball model
const SpotBall = require("../../models/SpotBall");
const constant = require("../../shared/constants");

// @route POST api/spotballs/get_active_image
// @desc Get active spotball image path url
// @access Public
router.get('/get_active_image', async (req, res) => {
    try {
        SpotBall
        .find({active:true})
        .then(spotball => {
            if (!spotball) {
                spotball = {};
            }
            return res.status(200).send({
                success: true,
                spotball: spotball,
            });
        })
        .catch(err => console.log(err));
    } catch (err) {
        res.json({ error: err.message || err.toString() });
    }
});

module.exports = router;
