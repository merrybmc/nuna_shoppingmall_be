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

// 상품 조회
productController.getProducts = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { kind, category } = req.query;

    let query = {};

    if (kind && kind !== 'null' && kind !== '') {
      query.kind = { $in: kind.split(',') };
    }
    if (category && category !== 'null' && category !== '') {
      query.category = { $in: category.split(',') };
    }

    const products = await Product.find(query);

    if (products.length === 0) throw new Error('상품이 존재하지 않습니다.');

    const men = products.filter((item) => item.kind === 'men');
    const women = products.filter((item) => item.kind === 'women');
    const kids = products.filter((item) => item.kind === 'kids');
    const top = products.filter((item) => item.category === 'top');
    const bottom = products.filter((item) => item.category === 'bottom');
    const shoes = products.filter((item) => item.category === 'shoes');
    const bag = products.filter((item) => item.category === 'bag');
    const accessory = products.filter((item) => item.category === 'accessory');

    req.products = {
      menData: men,
      womenData: women,
      kidsData: kids,
      topData: top,
      bottomData: bottom,
      shoesData: shoes,
      bagData: bag,
      accessoryData: accessory,
    };
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default productController;
