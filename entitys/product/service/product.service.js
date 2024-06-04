import Product from './../Product.Schema.js';

const productService = {};

// 상품 생성
productService.createProduct = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { sku, name, size, category, description, price, stock, status } = req.body;

    const images = req.files.map((file) => file.location);

    const product = new Product({
      sku,
      name,
      size,
      images,
      category: JSON.parse(category),
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
