import randomStringGenerator from '../../../utils/randomStringGenerator.js';
import productController from '../../product/controller/product.controller.js';
import Order from '../Order.Schema.js';
import Product from '../../product/Product.Schema.js';

const orderController = {};

orderController.createOrder = async (req, res, next) => {
  try {
    const { validTokenId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;

    console.log('Creating order for user:', validTokenId);

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
        // stock 배열에서 해당 사이즈를 찾아 재고를 감소시킴
        const stockItem = product.stock.find((stock) => stock.size === item.size);
        if (stockItem) {
          stockItem.qty -= item.qty;
        } else {
          throw new Error(`Product stock for size ${item.size} not found`);
        }
        await product.save();
      } else {
        throw new Error(`Product with ID ${item.productId} not found`);
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

export default orderController;
