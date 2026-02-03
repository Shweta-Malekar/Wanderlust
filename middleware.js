const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema, listingSchema } = require("./script.js");
const Review = require("./models/reviews.js");

//Authentication for checking user is logged in before requesting anything
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("err", "You must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

//saving our redirect that we have requested but bcoz we are not loggedin they take
// us to login page but after that we need to come back to the page that we have requested
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//authorization to check only authorized user can access our listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("err", "You are not owner of the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//authorization for reviews
module.exports.isReviewAuthor = async (req, res, next) => {
  // console.log(req.user);
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("err", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author._id.equals(req.user._id)) {
    req.flash("err", "You are not owner of the review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMssg = error.details.map((el) => el.message).join(",");
    console.log(errMssg);
    throw new ExpressError(400, errMssg);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMssg = error.details.map((el) => el.message).join(",");
    console.log(errMssg);
    throw new ExpressError(400, errMssg);
  } else {
    next();
  }
};
