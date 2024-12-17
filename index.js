const express=require('express');
const app =express();

require('dotenv').config();
const Course=require('./schema.js');
const mongoose=require('mongoose');
app.use('/uploads',express.static('./uploads'));

const multer  = require('multer')
const diskStorage=multer.diskStorage({
  destination:function(req,file,cb){ //cb callback
    console.log(file)
    cb(null,'uploads') //error null
  },
  filename:function(req,file,cb)
  {
    const ext=file.mimetype.split('/')[1];
    const fileName=`user-${Date.now()}.${ext}`;
    cb(null,fileName);
  }
})
const fileFilter=(req,file,cb)=>{
  const imageType=file.mimetype.split('/')[0];
  if(imageType==='image')
  {
     cb(null,true);
  }
  else{
   return cb("The file must be an image",false);
  }
}
const upload = multer({ storage:diskStorage,fileFilter: fileFilter})
app.use(express.json());
mongoose.connect(process.env.url).then(()=>{
  console.log("database is connected");
});


app.get('/courses',async(req,res)=>{
  const courses=await Course.find();
  res.json(courses);
})

app.get('/courses/:courseId',async(req,res)=>
{
  try{
  const course=await Course.findById(req.params.courseId);
  if(!course)
  {
    res.status(404).json({msg:"course not found"});
  }
  else {
    res.json(course);
  }}catch(error)
  {
     res.status(400).json({msg:"not valid object id"})
  }
    
})

//to post a new course
app.post('/courses',upload.single('avatar'),async(req,res)=>{
  try{
     
    const newCourse=new Course({
      title:req.body.title,
      price:req.body.price,
      avatar:req.file.filename
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  }catch(error)
  {
    res.json({error});
  }

})
app.patch('/courses/:courseId',async(req,res)=>{
   try{

    const updatedCourse=await Course.findByIdAndUpdate(req.params.courseId,{$set:{...req.body}});
    res.status(200).json({oldCourse:updatedCourse});
   }catch(error)
   {
      res.status(400).json({error:error});
   }

})
//delete a course
app.delete('/courses/:courseId',async(req,res)=>{
  const data=await Course.deleteOne({_id:req.params.courseId});
  res.json({msg:"course is deleted "});
})
app.listen(3000,()=>console.log("server is running on port 3000"));