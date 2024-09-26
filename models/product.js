const { BSON, ObjectId } = require('mongodb');

const getDB = require('../util/database').getDB;
const DB_TABLE ='products';
const User = require('./User');
class Product{
  constructor(title,price,imageUrl,description,id,userId){
    this.title = title;
    this.price = parseFloat(price);
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new BSON.ObjectId(id):null;
    this.userId = userId;
  };
  save(){
    const db = getDB();
    // {title:this.title,price:this.price,imageUrl:this.imageUrl,description:this.description,createdAt:this.createdAt}
    if(this._id){
      // updates the product as it exists
      this.updatedAtDate = new Date().toLocaleDateString();
      this.updatedAtTime = new Date().toLocaleTimeString();
      // this.createdAtDate = this.createdAtDate;
      // this.createdAtTime = this.createdAtTime;
      return db.collection(DB_TABLE).updateOne({_id:this._id},{$set:this}).then(result=>{
        console.log(result);
        console.log('Product updated Successfully');
      })
    }
    else{
      //adds the product
      this.createdAtDate = new Date().toLocaleDateString();
      this.createdAtTime = new Date().toLocaleTimeString();
      this.updatedAtDate = null;
      this.updatedAtTime = null;
      return db.collection(DB_TABLE).insertOne(this)
      .then(result=>console.log(result))
      .catch(err=>console.log(err));
    }
    
  }
  static fetchAll(){
    const db = getDB();
    return db.collection(DB_TABLE).find().toArray()
    .then(products=>{
      return products;
    })
    .catch(err=>console.log(err));
  }
  static findProduct(prodId){
    //prodId comes as string here so we need to convert it into BSON before finding
    const db = getDB();
    return db.collection(DB_TABLE).findOne({_id:new BSON.ObjectId(prodId)}).then(product=>product).catch(err=>console.log(err));
  }

  static deleteProduct(prodId){
    const db = getDB();
    return db.collection(DB_TABLE).deleteOne({_id:new BSON.ObjectId(prodId)}).then(()=>{
      //delete from cart of each User
      User.fetchAll().then(users=>{
        users.forEach(user=>{
          let currentCart = user.cart.items.filter(cartItem=> cartItem.productId.toString()!=prodId);
          const updatedCart = {
            items: currentCart
          }
          const newDB = getDB();
          newDB.collection('users').updateOne({_id:new ObjectId(user._id)},{$set:{cart:updatedCart}}).catch(err=>{
            console.log('Failed to delete product for user Id '+user._id);
            console.log(err);
          })
        });
      }).catch(err=>console.log(err));
    })
  }
}


module.exports = Product;


