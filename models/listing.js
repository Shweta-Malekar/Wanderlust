const mongoose = require("mongoose");
const Review = require("./reviews");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },

  location: {
    type: String,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    default: 0,
  },

  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", //here Review is model name of review
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
  } else {
    console.log("No listing found");
  }
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
