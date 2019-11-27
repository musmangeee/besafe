const mongoose = require("mongoose");
const { isEmail } = require("validator");
const common = require("../src/modules/common");

var userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      validate: [isEmail],
      required: true
    },
    password: { type: String, required: true, set: common.hash },
    birthYear: { type: String, required: true },
    gender: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "UsersData",
    strict: true
  }
);

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.checkPassword = async function(password) {
  if (common.hash(password) === this.password) {
    console.log(this);
    return this;
  }
  throw { status: 401 };
};

module.exports = mongoose.model("User", userSchema);
