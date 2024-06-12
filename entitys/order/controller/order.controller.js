import randomStringGenerator from '../../../utils/randomStringGenerator.js';
import productController from '../../product/controller/product.controller.js';
import Order from '../Order.Schema.js';

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

export default orderController;
