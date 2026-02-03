const Listing = require("../models/listing");

//index
module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

//New Listing Form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//Show Listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("err", "Listing you requested for does not exists");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//create Listing
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  // console.log(newListing);
  req.flash("Success", "New listing created");
  res.redirect("/listings");
};

//Search Listing
module.exports.searchListing = async (req, res) => {
  let country = req.query.country;

  let listing = await Listing.find({
    country: { $regex: country, $options: "i" },
  });
  if (!country) {
    req.flash("err", "Sorry,No listing for this country");
    return res.redirect("/listings");
  }
  res.render("./listings/index.ejs", { allListing: listing });
};

//edit listing
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("err", "Listing you requested for does not exists");
    res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_150,w_150");

  res.render("./listings/edit.ejs", { listing, originalImage });
};

//update listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
  );

  if (!listing) {
    req.flash("err", "Listing does not found");
    return res.redirect("/listings");
  }
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("Success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

//delete listing
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id, {}); //findByIdAndDelete triggers findOneAndDelete middleware
  // console.log(deletedListing);
  req.flash("Success", "Listing deleted succesfully");
  res.redirect("/listings");
};
