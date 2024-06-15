import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    images: { type: [String], required: true },
    kind: { type: String },
    category: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Object, required: true },
    status: { type: String, default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  return obj;
};

const Product = mongoose.model('Product', productSchema);

export default Product;
