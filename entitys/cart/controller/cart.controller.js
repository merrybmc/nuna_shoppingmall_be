import { populate } from 'dotenv';
import Cart from '../Cart.Schema.js';

const cartController = {};

// 카트 추가
cartController.addItemToCart = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { validTokenId } = req;
    const { productId, size, qty } = req.body;

    let cart = await Cart.findOne({ validTokenId });

    // 카트 자체가 없는지?
    if (!cart) {
      cart = new Cart({ validTokenId });
      await cart.save();
    }

    // 이미 카트에 들어가있는 아이템인지?
    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );

    if (existItem) throw new Error('이미 아이템이 카트에 담겨있습니다.');

    // 카트에 아이템 추가
    cart.items = [...cart.items, { productId, size, qty }];

    await cart.save();

    req.statusCode = 200;
    req.data = cart;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 카트 조회
cartController.getCart = async (req, res, next) => {
  try {
    const { validTokenId } = req;

    const cart = await Cart.findOne({ validTokenId }).populate({
      path: 'items',
      populate: { path: 'productId', model: 'Product' },
    });

    req.statusCode = 200;
    req.data = cart;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 카트 삭제
cartController.deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter((item) => !item._id.equals(id));

    await cart.save();
    req.statusCode = 200;
    req.data = cart;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default cartController;
