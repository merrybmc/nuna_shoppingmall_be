import randomStringGenerator from '../../../utils/randomStringGenerator.js';
import productController from '../../product/controller/product.controller.js';
import Order from '../Order.Schema.js';
import Product from '../../product/Product.Schema.js';

const orderController = {};

orderController.createOrder = async (req, res, next) => {
  try {
    const { validTokenId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;

    const insufficientStockItems = await productController.checkItemListStock(orderList);

    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce(
        (total, item) => (total += item.message),
        ''
      );
      throw new Error(errorMessage);
    }

    // 각 상품의 재고를 업데이트
    for (const item of orderList) {
      const product = await Product.findById(item.productId);
      if (product) {
        // stock 객체에서 해당 사이즈의 재고를 감소시킴
        if (product.stock[item.size] !== undefined) {
          product.stock[item.size] -= item.qty;
        } else {
          throw new Error('재고를 찾을 수 없습니다.');
        }

        await product.save();
      } else {
        throw new Error(`상품을 찾을 수 없습니다.`);
      }
    }

    const newOrder = new Order({
      userId: validTokenId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();

    res.status(200).json({ status: 'success', orderNum: newOrder.orderNum });
  } catch (e) {
    res.status(400).json({ status: 'fail', error: e.message });
  }
  next();
};

orderController.getOrder = async (req, res, next) => {
  try {
    const { validTokenId } = req;
    const PAGE_SIZE = 5;

    const orderList = await Order.find({ userId: validTokenId }).populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product',
        select: 'image images name',
      },
    });
    const totalItemNum = await Order.find({ userId: validTokenId }).count();

    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: 'success', data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};

export default orderController;
