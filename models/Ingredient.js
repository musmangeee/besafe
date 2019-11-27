const mongoose = require("mongoose");

let IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "IngredientsData",
    strict: true
  }
);

IngredientSchema.methods.toJSON = function() {
  var obj = this.toObject();
  return obj;
};

module.exports = mongoose.model("Ingredient", IngredientSchema);
