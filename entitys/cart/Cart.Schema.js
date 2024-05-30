const mongoose = require('mongoose');
const User = require('../user/User.Schema');
const Product = require('../product/Product.Schema');
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User },
    items: [
      {
        productId: { type: mongoose.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  return obj;
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
