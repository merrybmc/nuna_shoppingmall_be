import Product from './../Product.Schema.js';

const productController = {};

productController.createProduct = async (req, res, next) => {
  try {
    const { sku } = req.body;

    const SearchProduct = await Product.findOne({ sku: sku });

    if (SearchProduct) throw new Error('이미 존재하는 이름의 상품입니다.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default productController;
