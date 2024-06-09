import { response } from 'express';
import Product from './../Product.Schema.js';

const PAGE_SIZE = 5;

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

    const { page = 1, name, kind, category } = req.query;

    let productList = {};
    let cond = {};

    if (name) {
      cond.name = { $regex: name, $options: 'i' };
    }

    // Filtering logic based on provided kind and category values
    if (kind && !category) {
      cond.kind = { $in: kind.split(',') };
    } else if (!kind && category) {
      cond.category = { $in: category.split(',') };
    } else if (kind && category) {
      cond.kind = { $in: kind.split(',') };
      cond.category = { $in: category.split(',') };
    }

    const query = Product.find(cond);

    // If neither kind nor category is provided, apply pagination
    if (!kind && !category) {
      const totalItemNum = await Product.find(cond).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      const currentPage = page;
      const keyword = name;

      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);

      productList = {
        keyword,
        totalItemNum,
        totalPageNum,
        currentPage,
      };
    }

    const products = await query.exec();

    if (products.length === 0) throw new Error('상품이 존재하지 않습니다.');

    if (!kind && !category) {
      productList = { ...productList, products };
      req.products = productList;
    } else {
      if ((kind && kind.split(',').length > 1) || (category && category.split(',').length > 1)) {
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
      } else {
        req.products = { products };
      }
    }
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 상품 수정
productController.updateProduct = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { id } = req.params;
    const { sku, name, size, kind, category, description, price, stock, status } = req.body;

    const images = req.files.map((file) => file.location);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );

    if (!updatedProduct) throw new Error('상품이 존재하지 않습니다.');

    req.statusCode = 200;
    req.data = updatedProduct;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 상품 삭제
productController.deleteProduct = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { id } = req.params;

    const deleteProduct = await Product.findByIdAndDelete(id, { isDeleted: true });

    if (!deleteProduct) throw new Error('상품이 존재하지 않습니다.');

    req.statusCode = 200;
    req.data = deleteProduct;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default productController;
