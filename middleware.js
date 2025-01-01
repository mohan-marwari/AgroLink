const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Validation for Schema (Middleware)

function validateListing(req, res, next) {
  try {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    }
    next();
  } catch (err) {
    console.error("Validation Error:", err);
    next(err); // Pass the error to the error handler
  }
}

// Validation for Review (Middleware)
function validateReview(req, res, next) {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    }
    next();
  } catch (err) {
    console.error("Validation Error:", err);
    next(err); // Pass the error to the error handler
  }
}

// middleware.js
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;

  req.session.save((err) => {
    // Force save the session
    if (err) console.error("Session save error:", err);
    req.flash("error", "You must be logged in to view that page.");
    return res.redirect("/login");
  });
}

// middlewares/isOwner.js
async function isOwner(req, res, next) {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist!");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorized to edit/delete this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

// middlewares isReviewAuthor.js
async function isReviewAuthor(req, res, next) {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to perform this action.");
    return res.redirect(`/listings/${id}`);
  }

  next();
}

module.exports = {
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
  isReviewAuthor,
};
