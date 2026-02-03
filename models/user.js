const express=require("express");
const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:"String",
        required:true,
}//there is no need to define schema for username and password bcz passport-local-mongoose
  //setup those all like change password and all for us 
  //check this on npm.js and search passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);

module.exports=User;