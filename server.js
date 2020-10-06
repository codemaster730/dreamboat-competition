const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const fileUpload = require('express-fileupload');
const constants = require("./shared/constants");

const users = require("./routes/api/users");
const boats = require("./routes/api/boats");
const carts = require("./routes/api/carts");
const spotballs = require("./routes/api/spotballs");
const candidates = require("./routes/api/candidates");

const userAdmin = require("./routes/api/userAdmin");
const boatAdmin = require("./routes/api/boatAdmin");
const spotballAdmin = require("./routes/api/spotballAdmin");
const ticketAdmin = require("./routes/api/ticketAdmin");

require('dotenv').config();

const app = express();
app.use(fileUpload({
  limits: { fileSize: constants['MAX_UPLOAD_FILE_SIZE'] },
  createParentPath: true  
}));
app.use(express.static('uploads'));

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log('DB Connection Error: ', err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/boats", boats);
app.use("/api/carts", carts);
app.use("/api/spotballs", spotballs);
app.use("/api/candidates", candidates);

app.use("/api/useradmin", userAdmin);
app.use("/api/boatadmin", boatAdmin);
app.use("/api/spotballadmin", spotballAdmin);
app.use("/api/ticketadmin", ticketAdmin);

// Redirect Http to Https
app.use(function(req, res, next) {
  if ((req.get('X-Forwarded-Proto') !== 'https')) {
    res.redirect('https://' + req.get('Host') + req.url);
  } else
    next();
});

// Serve React

app.use(express.static(path.join(__dirname, "client", "build")));
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
