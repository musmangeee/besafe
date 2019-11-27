const express = require("express");
const router = express.Router();
const { User, SubProfile, Product, Ingredient } = require("../config/models");
const locker = require("../src/modules/locker");
const common = require("../src/modules/common");

router.post("/signup", async function(req, res, next) {
  try {
    let _user = await User.findOne({ email: req.body.email });
    if (_user) throw { status: 422 };
    console.log("_user", _user);
    let newUser = new User(req.body);
    let entry = await newUser.save();
    // console.log("entry", entry);
    res.reply({ data: entry });
  } catch (err) {
    next(err);
  }
});

router.post("/signin", async function(req, res, next) {
  try {
    let _user = await User.findOne({ email: req.body.email });
    let authUser = await _user.checkPassword(req.body.password);
    let accessToken = locker.lock(common.parse(authUser));
    res.reply({ data: accessToken });
  } catch (err) {
    next(err);
  }
});

router.post("/sub-profile", locker.unlock, async function(req, res, next) {
  try {
    let user = new SubProfile({ ...req.body, user: req.user.id });
    let entry = await user.save();
    entry = await SubProfile.findOne({ _id: entry.id })
      .populate("user")
      .populate("sensitivities");

    res.reply({ data: entry });
  } catch (err) {
    next(err);
  }
});

router.put("/sub-profile/:id", locker.unlock, async function(req, res, next) {
  try {
    let entry = await SubProfile.findOne({ _id: req.params.id });
    if (!entry) throw { status: 404 };
    entry.sensitivities = req.body.sensitivities;
    entry.name = req.body.name;
    let savedData = await entry.save();
    savedData = await SubProfile.findOne({ _id: savedData.id })
      .populate("user")
      .populate("sensitivities");

    res.reply({ data: savedData });
  } catch (err) {
    next(err);
  }
});

router.delete("/sub-profile/:id", locker.unlock, async function(
  req,
  res,
  next
) {
  try {
    let entry = await SubProfile.findOne({ _id: req.params.id });
    if (!entry) throw { status: 404 };
    entry = await entry.remove();
    res.reply({ data: entry });
  } catch (err) {
    next(err);
  }
});

router.get("/sub-profile/:id", locker.unlock, async function(req, res, next) {
  try {
    let entry = await SubProfile.findOne({ _id: req.params.id })
      .populate("user")
      .populate("sensitivities");
    if (!entry) throw { status: 404 };
    res.reply({ data: entry });
  } catch (err) {
    next(err);
  }
});

router.get("/sub-profile", locker.unlock, async function(req, res, next) {
  try {
    let entry = await SubProfile.find({ user: req.user._id })
      .populate("user")
      .populate("sensitivities");
    if (!entry) throw { status: 404 };
    res.reply({ data: entry });
  } catch (err) {
    next(err);
  }
});

router.get("/sensitivities", locker.unlock, async function(req, res, next) {
  try {
    let entry = await Ingredient.find();
    if (!entry) throw { status: 404 };
    res.reply({ data: entry });
  } catch (err) {
    next(err);
  }
});

router.post("/sub-profile/:id/look-up", locker.unlock, async function(
  req,
  res,
  next
) {
  try {
    let _user = await SubProfile.findOne({ _id: req.params.id });
    let _product = await Product.findOne({ _id: req.body.upc });
    // console.log("_product", _product);
    // console.log("_user", _user);
    if (!_user || !_product) throw { status: 404 };
    let passFlag = true;
    let invalidIngredients = [];
    let stringIds = _product.ingredients.map(k => k.toString());
    let relatedProducts = [];
    _user.sensitivities.map(e => {
      if (stringIds.includes(e.toString())) {
        invalidIngredients.push(e.toString());
        passFlag = false;
      }
    });
    if (!passFlag) {
      let moreProducts = await Product.find({
        categories: { $in: _product.categories[0] },
        type: _product.type
      });
      moreProducts.map(e => {
        let arr = e.ingredients
          .map(e => e.toString())
          .filter(value => -1 !== stringIds.indexOf(value));
        console.log("arr", e);
        if (!arr.length) relatedProducts.push(e);
      });

      console.log("moreProducts", moreProducts);
    }
    res.reply({
      data: {
        is_safe: passFlag,
        invalid_ingredients: invalidIngredients,
        related_products: relatedProducts
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
