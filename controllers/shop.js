const Product = require('../models/product');
// const Cart = require('../models/Cart');
// const Order = require('../models/order');


//configured wrt to MongoDB
exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err=>console.log(err));
};
exports.getSingleProduct = (req,res)=>{
  const prodId = req.params.productId;
  Product.findProduct(prodId).then(recievedProduct=>{
    res.render('shop/product-detail',{
      product:recievedProduct,
      pageTitle:recievedProduct.title,
      path:'/products',
    });
  }).catch(err=>console.log(err));
}
//
exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
};

exports.getCart =(req, res, next) => {
  req.user.getCart().then(productArray=>{
    res.render('shop/cart',{
      product:productArray,
      path:'/cart',
      pageTitle: 'CART'
    });
  }).catch(err=>console.log(err));
  // let fetchedCart;
  // let productArray;
  // req.user.getCart()
  // .then(cart=>{
  //   if(cart==null){
  //     productArray=[];
  //   }
  //   else{
  //     fetchedCart = cart;
  //     return fetchedCart.getProducts();
  //   }
  // })
  // .then(prods=>{
  //   if(prods==null){
  //     productArray=[];
  //   }else{
  //     productArray=prods;
  //   }
  //   res.render('shop/cart',{
  //       product:productArray,
  //       path:'/cart',
  //       pageTitle: 'CART'
  //     });
  // })
  // .catch(err=>console.log(err));
};
//post cart working fine for now
exports.postCart=(req,res,next)=>{
  const prodId = req.body.productId;
  Product.findProduct(prodId).then(product=>{
    // console.log(product);
    return req.user.addToCart(product);
  })
  .then(()=>res.redirect('/cart'))
  .catch(err=>console.log(err));

  // let fetchedCart;
  // req.user.getCart().then(cart=>{
  //   if(cart==null){
  //     return req.user.createCart();
  //   }
  //   return cart;
  //   // checks whether the entry in cart table exists or not where userId = loggedInUser UID
  //   // if not creates one
  // }).then(cart=>{
  //   // we always get a cart object where we have userId set to loggedInUser UID
  //   // not clear of what this getProducts function do
  //   //shayad se yeh aisa dekh rha hai ki cartItem mein koi aisa product hai for a user with UID jiska id = given id ho ------ if YES then vo return kardega aise product ki saari detail warna cartItem mein agar present nhi hai to return karega NULL
  //   fetchedCart = cart;
  //   return cart.getProducts({where:{id:prodId}});
  // })
  // .then(products=>{
  //   let product;
  //   if(products!=null){
  //     product = products[0];
  //   }
  //   if(product){
  //     // update the quantity and save the product
  //     // return fetchedCart.setProduct(product,{through:{qty:qty+1}});
  //     return fetchedCart.addProduct(product,{through:{qty:product.cartitem.qty+1}});
  //   }
  //   else{
  //     // get the product with that product id and add it to the cart item using cart table
  //     return Product.findByPk(prodId).then(product=>{
  //       return fetchedCart.addProduct(product,{through:{qty:1}});
  //     }).catch(err=>console.log(err));
  //   }
  // })
  // .then(()=>res.redirect('/cart'))
  // .catch();
}
exports.deleteFromCart = (req,res,next)=>{
  const prodId = req.body.productId;
  // console.log('productId is '+prodId);
  req.user.deleteFromCart(prodId).then(()=>res.redirect('/cart')).catch(err=>console.log(err));
  // await Cart.destroy({where:{id:prodId}});
  // req.user.getCart()
  // .then(cart=>{
  //   fetchedCart = cart;
  //   return cart.getProducts({where:{id:prodId}});
  // })
  // .then(product=>{
  //     return fetchedCart.removeProduct(product);
  //     // you could have also used product.cartItem.destroy();
  // })
  // .then(()=>{
  //   res.redirect('/cart');
  // })
  // .catch(err=>console.log(err));
}
exports.getOrders = (req, res, next) => {
  req.user.getOrders().then(orders=>{
    res.render('shop/orders', {
      orders:orders,
      path: '/orders',
      pageTitle: 'Your Orders'
    });
  }).catch(err=>console.log(err));
  // let orderArray;
  // req.user.getOrders({include:['product']})
  // .then(orders=>{
  //   if(orders==null){
  //     orderArray=[];
  //   }
  //   else{
  //     orderArray=orders;
  //   }
  //  
  // })
  // .catch(err=>console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req,res,next)=>{
  req.user.addToOrder().then(res.redirect('/orders')).catch(err=>console.log(err));
  // let fetchedCart;
  // req.user.getCart()
  // .then(cart=>{
  //   fetchedCart = cart;
  //   return fetchedCart.getProducts();
  // })
  // .then(products=>{
  //   req.user.createOrder().then(order=>{
  //     order.addProducts(products.map(product=>{
  //       product.orderitem = {qty:product.cartitem.qty};
  //       return product;
  //     }))
  //   })
  // })
  // .then(result=>{
  //   fetchedCart.setProduct(null);
  //     res.redirect('/orders');
  // })
  // .catch(err=>console.log(err));
};
