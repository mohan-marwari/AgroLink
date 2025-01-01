const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const reviewsControllers = require("../controllers/reviews");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

// Review

// Post Route
router.post(
  "/listings/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsControllers.createReview)
);

// Delete Review Route
router.delete(
  "/listings/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsControllers.deleteReview)
);

module.exports = router;
