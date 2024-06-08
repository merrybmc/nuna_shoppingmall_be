import Cart from '../Cart.Schema.js';

const cartController = {};

cartController.addItemToCart = async (req, res, next) => {
  try {
    const { validTokenId } = req;
    const { productId, size, qty } = req.body;

    let cart = await Cart.findOne({ validTokenId });

    // 카트 자체가 없는지?
    if (!cart) {
      cart = new Cart({ validTokenId });
      await cart.save();
    }

    // 이미 카트에 들어가있는 아이템인지?
    const existItem = cart.item.find(
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
    req.error = e.error;
  }
  next();
};

export default cartController;
