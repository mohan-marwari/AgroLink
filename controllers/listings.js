const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  res.render("../views/listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for dose not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", {
    listing,
    mapToken: process.env.MAP_TOKEN,
    coordinates: listing.geometry.coordinates,
  });
};
module.exports.createListing = async (req, res) => {
  try {
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user.id;
    newListing.image = { url, filename };

    // Pehle geocoding response fetch karo
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location, // User input location
        limit: 1,
      })
      .send();

    // Phir geometry ko set karo response ke basis par
    newListing.geometry = response.body.features[0].geometry;

    // Listing save karo
    const saveListing = await newListing.save();
    console.log(saveListing);

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings/new");
  }
};

module.exports.editListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
  }

  // Update geometry based on new location
  if (req.body.listing.location) {
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location, // The updated location
        limit: 1,
      })
      .send();

    if (response.body.features.length > 0) {
      listing.geometry = {
        type: "Point",
        coordinates: response.body.features[0].geometry.coordinates, // [longitude, latitude]
      };
    }
  }

  // Save the updated listing
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  console.log(listing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
