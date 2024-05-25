const Blog=require('../models/blogModel')
const { validate } = require('../models/userModel')
validate
const asyncHandler=require("express-async-handler")
const User= require("../models/userModel");
const validateMongoDbId=require("../utils/validateMongodbId")


const createBlog= asyncHandler(async(req,res)=>{
    try{
        const newBlog=await Blog.create(req.body)
        res.json(newBlog)
    }
    catch(error){
        throw new Error(error)
    }

})

const updateBlog= asyncHandler(async(req,res)=>{
    const{id}=req.params;
    validateMongoDbId(id);

    try{
        const updateBlog=await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateBlog)
    }
    catch(error){
        throw new Error(error)
    }

})

const getBlog= asyncHandler(async(req,res)=>{
    const{id}=req.params;
    validateMongoDbId(id);

    try{
        const getBlog=await Blog.findById(id).populate("likes").populate("dislikes")
        const updateViews=await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1}
        },{new:true})
        res.json(getBlog)
    }
    catch(error){
        throw new Error(error)
    }

})
const getAllBlog= asyncHandler(async(req,res)=>{
    try{
        // User.find() asenkron bir işlem olduğu için await anahtar kelimesiyle beklenir.
        const getBlogs= await Blog.find()
        res.json(getBlogs);
    }
    catch(error){
        throw new Error(error)
    }

})

const deleteBlogs=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    validateMongoDbId(id);
    try{
        const deletedBlog= await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    }
    catch(error){
        throw new Error(error)
    }
})

const likeBlog=asyncHandler(async(req,res)=>{
    const {blogId}= req.body;
    validateMongoDbId(blogId)
    //Find the blog which you want to be liked
    const blog=await Blog.findById(blogId);
    //find the login user
    const loginUserId=req?.user?._id;
    //find if the user has liked the blog
    const isLiked=blog?.isLiked;
    //find if the user has disliked the blog
    const alreadyDisliked= blog?.dislikes?.find((userId)=>userId?.toString()===loginUserId?.toString())
    if(alreadyDisliked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false
        },{new:true}
    ) 
    res.json(blog)
    }
    if(isLiked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false
        },{new:true}
    ) 
    res.json(blog)
    }
    else{
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUserId},
            isLiked:true
        },{new:true}
    ) 
    res.json(blog)
    }
})

const dislikeBlog=asyncHandler(async(req,res)=>{
    const {blogId}= req.body;
    validateMongoDbId(blogId)
    //Find the blog which you want to be liked
    const blog=await Blog.findById(blogId);
    //find the login user
    const loginUserId=req?.user?._id;
    //find if the user has liked the blog
    const isDisLiked=blog?.isDisLiked;
    //find if the user has disliked the blog
    const alreadyLiked= blog?.likes?.find((userId)=>userId?.toString()===loginUserId?.toString())
    if(alreadyLiked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false
        },{new:true}
    ) 
    res.json(blog)
    }
    if(isDisLiked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false
        },{new:true}
    ) 
    res.json(blog)
    }
    else{
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $push:{dislikes:loginUserId},
            isDisliked:true
        },{new:true}
    ) 
    res.json(blog)
    }
})


module.exports={ createBlog ,updateBlog,getBlog, getAllBlog,deleteBlogs,likeBlog,dislikeBlog};





