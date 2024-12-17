const mongoose=require('mongoose');
const fs=require('fs');
const path=require('path');

const Schema= mongoose.Schema;
const courseSchema=new Schema({
  
  title:{
    type:String,
    required:[true,"title is required"]
    
  },
  price:{
    type:Number,
    required:true
  },
  avatar:{
   type:String,
   defualt:'1.jpeg'

    
  }
})
module.exports=mongoose.model('courses',courseSchema);