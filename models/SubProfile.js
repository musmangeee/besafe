const mongoose = require("mongoose");

let subProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sensitivities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }]
  },
  {
    timestamps: true,
    collection: "SubProfilesData",
    strict: true
  }
);

subProfileSchema.methods.toJSON = function() {
  var obj = this.toObject();
  return obj;
};

module.exports = mongoose.model("SubProfile", subProfileSchema);
