const Product = require('../models/product');
const { getDB } = require('../util/database');
// const Cart = require('../models/Cart');
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
    // formsCSS: true,
    // productCSS: true,
    // activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
 const product = new Product(title,price,imageUrl,description,null,req.user._id);
  product.save()
  .then(() =>{
    console.log('Added Product successfully');
    res.redirect('/');
  })
  .catch(err => console.log(err));
  
};
exports.getEditProduct = (req,res,next)=>{
  const prodId = req.params.productID;
  const editMode = req.query.edit;

  Product.findProduct(prodId).then(product=>{
    res.render('admin/edit-product',{
      pageTitle: 'Edit Product',
      path:'/admin/edit-product',
      product:product,
      editing:editMode
    })
  });
}
exports.postEditProduct =async (req,res,next)=>{
  const prodId = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const product = new Product(updatedTitle,updatedPrice,updatedImageUrl,updatedDescription,prodId,req.user._id);
  await product.save();
  res.redirect('/');
}
exports.postDeleteProduct = (req,res,next)=>{
  const prodId = req.body.prodID;
  Product.deleteProduct(prodId)
  .then(result=>{

    //later write a logic that if admin deletes that product then it should be deleted from all the user carts as well
    console.log(result);
    res.redirect('/admin/products');
  });
}
exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
};
