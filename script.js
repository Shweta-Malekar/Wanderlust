const Joi = require("joi");

// validation for listing schema
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.alternatives()
      .try(
        Joi.string().allow("", null),
        Joi.object({
          filename: Joi.string(),
          url: Joi.string().allow("", null).default("/images/default.jpg"),
        }),
      )
      .default({ filename: Joi.string(), url: "/images/default.jpg" }),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

//validation for review schema
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
