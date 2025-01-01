const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");


//Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
      res.render("listings/home.ejs");
    })
  );

  module.exports = router;