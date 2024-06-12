import mongoose from 'mongoose';
import User from '../user/User.Schema.js';
import Product from '../product/Product.Schema.js';
import Cart from '../cart/Cart.Schema.js';

const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User, required: true },
    orderNum: { type: String },
    shipTo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
    },
    contact: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      contact: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    status: { type: Boolean, required: false },
    items: [
      {
        productId: { type: mongoose.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updatedAt;
  return obj;
};

orderSchema.post('save', async function () {
  const cart = await Cart.findOne({ validTokenId: this.userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
