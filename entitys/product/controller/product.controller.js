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

    if (kind) {
      cond.kind = { $in: kind.split(',') };
    }
    if (category) {
      cond.category = { $in: category.split(',') };
    }

    if (!kind && !category) {
      const totalItemNum = await Product.countDocuments(cond);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      const currentPage = page;
      const keyword = name;

      productList = {
        keyword,
        totalItemNum,
        totalPageNum,
        currentPage,
      };
    }

    // Fetch products
    const products = await Product.find(cond)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .exec();

    if (products.length === 0) throw new Error('상품이 존재하지 않습니다.');

    if (!kind && !category) {
      productList = { ...productList, products };
      req.products = productList;
    } else {
      // Categorize products
      const categorizedProducts = products.reduce((acc, item) => {
        const { kind, category } = item;
        acc[kind] = acc[kind] || [];
        acc[kind].push(item);
        acc[category] = acc[category] || [];
        acc[category].push(item);
        return acc;
      }, {});

      req.products = categorizedProducts;
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
