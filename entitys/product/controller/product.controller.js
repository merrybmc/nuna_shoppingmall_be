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

    const query = Product.find(cond);

    // const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
    // const query = Product.find(cond);

    // if (kind) {
    //   query.where('kind').in(kind.split(','));
    // }

    // if (category) {
    //   query.where('category').in(category.split(','));
    // }

    if (!kind && !category) {
      // 데이터 총 개수
      const totalItemNum = await Product.find(cond).count();

      // 총 페이지 개수
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

      // 현재 페이지
      const currentPage = page;

      const keyword = name;

      // 페이지네이션
      // mongoose 함수
      // skip = 앞의 데이터를 숫자만큼 스킵
      // limit = 보내줄 데이터 개수
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);

      productList = {
        keyword,
        totalItemNum,
        totalPageNum,
        currentPage,
      };
    }
    // case 1
    // const products = await Product.find({ name: { $regex: name, $options: 'i' } });

    // case 2
    const products = await query.exec();

    if (products.length === 0) throw new Error('상품이 존재하지 않습니다.');

    // const productList = {
    //   totalItemNum,
    //   totalPageNum,
    //   currentPage,
    //   products,
    // };

    if (!kind && !category) {
      productList = { ...productList, products };
      req.products = productList;
    } else {
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
    }
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default productController;
