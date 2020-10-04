const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// Load CartItem model
const Boat = require("../../models/Boat");
const constant = require("../../shared/constants");


// @route POST api/boatadmin/boatlist
// @desc Get boats
// @access Public
router.post("/boatlist", (req, res) => {
    Boat
    .find({}).sort({model: 1})
    .then(boats => {
        if (!boats) {
            boats = [];
        }
        return res.json({
            success: true,
            boats: boats
        });
    })
    .catch(err => console.log(err));
});

// @route POST api/boatadmin/boat/:boatId
// @desc Update Boat
// @access Public
router.put("/boat/:boatId", (req, res) => {
    // Validate Request
    if(!req.body.boat) {
        return res.status(400).send({
            message: "Boat detail can not be empty"
        });
    }
    // Find boat and update it with the request body
    Boat.findByIdAndUpdate(req.params.boatId, req.body.boat, {new: true})
    .then(boat => {
        if(!boat) {
            return res.status(404).send({
                message: "Boat not found with id " + req.params.boatId
            });
        }else{
            return res.status(200).send({
                message: "Boat updated successfully ",
                boat: boat,
            });
        }
        //res.send(boat);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "boat not found with id " + req.params.boatId
            });                
        }
        return res.status(500).send({
            message: "Error updating boat with id " + req.params.boatId
        });
    });
});



// @route POST api/boatadmin/boat/create
// @desc Add Boat
// @access Public
router.post("/boat/create", (req, res) => {
    console.log(req.body.boat);
    if (!req.body.boat._id) {
      const boat = new Boat({...req.body.boat});
      boat
        .save()
        .then((boat) => {
          //return res.status(200).json(boat);
          return res.status(200).send({
                boat: boat,
                message: "New boat has created.",
            });  
        })
        .catch((err) => console.log(err));
    }
  });



// @route DELETE api/boatadmin/boat/:id
// @desc Delete boat
// @access Public
router.delete("/boat/:boatId", (req, res) => {
    Boat.findByIdAndRemove(req.params.boatId)
    .then(boat => {
        if(!boat) {
            return res.status(404).send({
                message: "Boat not found with id " + req.params.boatId
            });
        }
        res.status(200).send({message: "Boat deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Boat not found with id " + req.params.boatId
            });                
        }
        return res.status(500).send({
            message: "Could not delete boat with id " + req.params.boatId
        });
    });
  
  });

// @route POST api/boatadmin/boat/upload_img
// @desc Upload image file
// @access Public
router.post('/boat/upload_img', async(req, res) => {
    try {
      if(!req.files) {
        console.log("files not found");
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          
          const imgFile = req.files.file;
          var paths = [];
          var names = [];
          if(imgFile.length===undefined){
            const id = crypto.randomBytes(16).toString("hex");
                imgFile.mv('./uploads/' + id+imgFile.name, (err) => {
                    if (err) {
                        return res.status(500).send({ msg: "Error occured" });
                    }
                });
                paths.push(constant['UPLOAD_URL']+id+imgFile.name);
                names.push(id+imgFile.name);
          }else{
            for(let i=0; i<imgFile.length; i++){
                const id = crypto.randomBytes(16).toString("hex");
                imgFile[i].mv('./uploads/' + id+imgFile[i].name, (err) => {
                    if (err) {
                        return res.status(500).send({ msg: "Error occured" });
                    }
                });
                paths.push(constant['UPLOAD_URL']+id+imgFile[i].name);
                names.push(id+imgFile[i].name);
            }
          }
          if(names.length>0)
            return res.send({names: names, paths: paths});
      }
    } catch (err) {
        res.status(500).send(err);
    }
  });

module.exports = router;
