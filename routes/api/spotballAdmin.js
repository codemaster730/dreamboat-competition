const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// Load spotball model
const SpotBall = require("../../models/SpotBall");
const constant = require("../../shared/constants");


// @route POST api/spotballadmin/spotballlist
// @desc Get spotballs
// @access Public
router.post("/spotballlist", (req, res) => {
    SpotBall
    .find({}).sort({active: -1})
    .then(spotballs => {
        if (!spotballs) {
            spotballs = [];
        }
        return res.json({
            success: true,
            spotballs: spotballs
        });
    })
    .catch(err => console.log(err));
});


// @route POST api/spotballadmin/spotball/:spotballId
// @desc Update SpotBall
// @access Public
router.put("/spotball/:spotballId", (req, res) => {
    // Validate Request
    if(!req.body.spotball) {
        return res.status(400).send({
            message: "SpotBall detail can not be empty"
        });
    }
    // Find spotball and update it with the request body
    if(req.body.spotball.active === true){
        SpotBall.updateMany({id:{$ne:req.body.spotball._id}},
            {active:false}, function (err, docs) { 
            if (err){ 
                console.log(err) 
            } 
            else{ 
            } 
        });
    }
    SpotBall.findByIdAndUpdate(req.params.spotballId, req.body.spotball, {new: true})
    .then(spotball => {
        if(!spotball) {
            return res.status(404).send({
                message: "SpotBall not found with id " + req.params.spotballId
            });
        }else{
            return res.status(200).send({
                message: "SpotBall updated successfully ",
                spotball: spotball,
            });
        }
        //res.send(spotball);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "spotball not found with id " + req.params.spotballId
            });                
        }
        return res.status(500).send({
            message: "Error updating spotball with id " + req.params.spotballId
        });
    });
});



// @route POST api/spotballadmin/spotball/create
// @desc Add SpotBall
// @access Public
router.post("/spotball/create", (req, res) => {
    
    if (!req.body.spotball._id) {
      const spotball = new SpotBall({...req.body.spotball});
      spotball
        .save()
        .then((spotball) => {
          //return res.status(200).json(spotball);
          return res.status(200).send({
                spotball: spotball,
                message: "New spotball has created.",
            });  
        })
        .catch((err) => console.log(err));
    }
  });



// @route DELETE api/spotballadmin/spotball/:id
// @desc Delete spotball
// @access Public
router.delete("/spotball/:spotballId", (req, res) => {
    SpotBall.findByIdAndRemove(req.params.spotballId)
    .then(spotball => {
        if(!spotball) {
            return res.status(404).send({
                message: "SpotBall not found with id " + req.params.spotballId
            });
        }
        res.status(200).send({message: "SpotBall deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "SpotBall not found with id " + req.params.spotballId
            });                
        }
        return res.status(500).send({
            message: "Could not delete spotball with id " + req.params.spotballId
        });
    });
  
  });

// @route POST api/spotballadmin/spotball/upload_img
// @desc Upload image file
// @access Public
router.post('/spotball/upload_img', async(req, res) => {
    try {
      if(!req.files) {
        console.log("files not found");
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          
          const imgFile = req.files.file;
            const id = crypto.randomBytes(16).toString("hex");
            imgFile.mv('./uploads/' + id+imgFile.name, (err) => {
                if (err) {
                    return res.status(500).send({ msg: "Error occured" });
                }
                return res.status(200).send({name: id+imgFile.name, path: constant['UPLOAD_URL']+id+imgFile.name});
            });
            
      }
    } catch (err) {
        res.status(500).send(err);
    }
  });

module.exports = router;
