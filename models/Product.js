const mongoose = require("mongoose");

let productSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
    categories: [{ type: String, require: true }]
  },
  {
    timestamps: true,
    collection: "ProductsData",
    strict: true
  }
);

productSchema.methods.toJSON = function() {
  var obj = this.toObject();
  return obj;
};

module.exports = mongoose.model("Product", productSchema);
