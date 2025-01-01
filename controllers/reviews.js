const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const review = new Review(req.body.review);
  review.author = req.user._id;
  console.log(review);

  await review.save();
  const listing = await Listing.findById(id);

  listing.reviews.push(review._id);
  await listing.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
