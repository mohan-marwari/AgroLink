const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    // res.render("listings/home.ejs");
    // const allListings = await Listing.find({});
    // res.render("listings/index.ejs", { allListings });
    res.redirect("/listings");
  })
);

module.exports = router;
