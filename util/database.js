const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient;
let _db;

const mongoConnect = callBack=>{
    MongoClient.connect(process.env.DB_URL)
    .then(client=>{
    console.log('connnected!');
    _db = client.db();
    callBack();
})
    .catch();
}
const getDB = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found';
}
exports.mongoConnect = mongoConnect;
exports.getDB = getDB;