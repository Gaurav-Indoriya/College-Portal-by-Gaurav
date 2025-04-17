const mongoose = require('mongoose');
//const localurl = "mongodb://localhost:27017/collegeportalpractice";
const liveurl = "mongodb+srv://gauravindoriya82:Gaurav9827@cluster0.8o48ro7.mongodb.net/?retryWrites=true&w=majority&appName=collegeportal"
const connectdb = ()=>{
    return mongoose.connect(liveurl)
    .then(()=>{
        console.log("database connected successfully");
    })
    .catch((error)=>{
        console.log("error while connecting to database",error);
    })
}
module.exports = connectdb;

