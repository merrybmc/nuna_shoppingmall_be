import Product from './../Product.Schema.js';

const productController = {};

// 상품 생성
productController.createProduct = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { sku } = req.body;

    const SearchProduct = await Product.findOne({ sku: sku });

    if (SearchProduct) throw new Error('이미 존재하는 이름의 상품입니다.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

productController.getProducts = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const products = await Product.find({});

    if (products.length === 0) throw new Error('상품이 존재하지 않습니다.');

    req.products = products;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default productController;
