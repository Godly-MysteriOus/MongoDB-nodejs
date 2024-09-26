const crypto = require('crypto');
const { getDB } = require('../util/database');
const {BSON, ObjectId} = require('mongodb');
const DB_TABLE = 'users';
const ORDER_TABLE = 'orders';
class User{
    constructor(name,emailId,contactNumber,password,id,cart){
        this.name = name;
        this.emailId = emailId;
        this.contactNumber = contactNumber;
        this.password = User.getHashedValue(password);
        this._id = id? new BSON.ObjectId(id):null;
        this.cart = cart; //{items:[]};
    }
    static getHashedValue(valueToBeHashed){
        return crypto.createHash('sha256').update(valueToBeHashed).digest('hex');
        //using sha256 encoding algorithm
    }
    addToCart(product){
        const db= getDB();
        // if product is present in DB then update the quantity else add the product to the cart

        //matching whether product is present in the cart or not;
        let cartProductIndex;
        let currentCart;
        if(this.cart==null){
            // if we dont have any product in cart it assigns empty array to currentCart and makes cartProductIndex as -1 so that we can know we have to add the product
            currentCart=[];
            cartProductIndex = -1;
        }else{
            currentCart = [...this.cart.items];
            currentCart.forEach((item,i)=>{
                if(item.productId.toString()===product._id.toString()){
                    cartProductIndex = i;
                    return;
                }
            });
            if(cartProductIndex<0 || cartProductIndex == undefined){
                cartProductIndex = -1;
            }
        }
        let newQuantity = 1;
        if(cartProductIndex>=0){
            //prouduct exists so just increase the quantity
            newQuantity = currentCart[cartProductIndex].quantity + 1;
            currentCart[cartProductIndex].quantity = newQuantity;
        }else{
            //product do not exists so add the product
            const newProduct = {productId:new BSON.ObjectId(product._id), quantity:newQuantity};
            currentCart = [...currentCart,newProduct];
        }
        // updated cart 
        const updatedCart = {
            items:currentCart
        }
       return db.collection(DB_TABLE).updateOne({_id:this._id},{$set:{cart:updatedCart}}).catch(err=>console.log(err));
    }
        save(){
        const db = getDB();
        if(this._id){
            // id exists therefore update logic here
            this.updatedAt = new Date().toLocaleDateString();
            this.updatedAtTime = new Date().toLocaleTimeString();
            return db.collection(DB_TABLE).updateOne({_id:this._id},{$set:this}).then(res=>{
                console.log(res);
                console.log('User Updated');
            }).catch(err=>console.log(err));
        }else{
            // id is null means user does not exists and need to be added
            this.createdAt = new Date().toLocaleDateString();
            this.createdAtTime = new Date().toLocaleTimeString();
            this.updatedAt = null;
            this.updatedAtTime = null;
           return db.collection(DB_TABLE).insertOne(this).then(result=>{
            console.log(result);
            console.log('Added User successfully');
           }).catch(err=>console.log(err));
        }
    }
    static fetchAll(){
        const db = getDB();
       return db.collection(DB_TABLE).find().toArray().then(products=>products).catch(err=>console.log(err));
    }
    getCart(){
        // used to get all products present in the cart table
        

        // either do this and write entire logic in the route or
        //return this.cart;

        const db = getDB();
        const productIdsInCart = this.cart.items.map(i=>i.productId);
        //creates an array where only the productId is stored which are present in the cart
       return db.collection('products').find({_id:{$in:productIdsInCart}}).toArray()
        .then(products=>{
            return products.map(product=>{
                const findIndexOfMatchingProductID_InCart= this.cart.items.findIndex(item=>product._id.toString()==item.productId.toString());
                // console.log(product._id+" is present at " +findIndexOfMatchingProductID_InCart+" index");
                return {...product, quantity:this.cart.items[findIndexOfMatchingProductID_InCart].quantity};
            })
        })
        .then(products=>{
            return products;
        })
        .catch(err=>console.log(err));
    }
    deleteFromCart(prodId){
        let currentCart = [...this.cart.items];
        //removed the product from the cart
        currentCart = currentCart.filter(item=>item.productId.toString()!==prodId);
        const db = getDB();
        const updatedCart = {
            items:currentCart
        }
        return db.collection(DB_TABLE).updateOne({_id:this._id},{$set:{cart:updatedCart}})
        .then(result=>console.log(result))
        .catch(err=>console.log(err));
    }
    addToOrder(){
        const db = getDB();
        return this.getCart().then(products=>{
            const order = {
                user:{
                    _id: this._id,
                    name : this.name,
                },
                items:products,
            }
            db.collection(ORDER_TABLE).insertOne(order);
        }).then(()=>{
            db.collection(DB_TABLE).updateOne({_id:this._id},{$set:{cart:{items:[]}}});
        })
        .catch(err=>console.log(err));
    }
    getOrders(){
        const db = getDB();
        return db.collection(ORDER_TABLE).find({'user._id':this._id}).toArray().then(orders=>orders).catch(err=>console.log(err));
    }
}
module.exports = User;