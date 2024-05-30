const mongoose = require('mongoose');
const User = require('../user/User.Schema');
const Product = require('../product/Product.Schema');
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User },
    shipTo: { type: String, required: true },
    contact: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: Boolean, required: false },
    items: [
      {
        productId: { type: mongoose.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        price: { type: Number, require: true, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  return obj;
};

const Order = mongoose.model('Other', orderSchema);
module.exports = Order;
