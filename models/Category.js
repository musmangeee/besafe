const mongoose = require("mongoose");

let CategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parent: { type: String, required: true },
    category: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "Categories",
    strict: true
  }
);

CategoriesSchema.methods.toJSON = function() {
  var obj = this.toObject();
  return obj;
};

module.exports = mongoose.model("Category", CategoriesSchema);
