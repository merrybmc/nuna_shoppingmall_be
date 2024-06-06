import Product from './../Product.Schema.js';

const productService = {};

// 상품 생성
productService.createProduct = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { sku, name, size, kind, category, description, price, stock, status } = req.body;

    const images = req.files.map((file) => file.location);

    const product = new Product({
      sku,
      name,
      size,
      images,
      kind,
      category,
      description,
      price,
      stock: JSON.parse(stock),
      status,
    });

    await product.save();

    req.statusCode = 200;
    req.data = product;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 상품 조회
productService.getProducts = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { products } = req;

    req.statusCode = 200;
    req.data = products;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default productService;
