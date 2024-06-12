import mongoose from 'mongoose';
import User from '../user/User.Schema.js';
import Product from '../product/Product.Schema.js';

const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    validTokenId: { type: mongoose.ObjectId, ref: User, required: true },
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

export default Cart;
