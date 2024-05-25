const Category=require('../models/blogCatModel.js')
const asyncHandler=require("express-async-handler")
const validateMongoDbId=require("../utils/validateMongodbId.js")

const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory=await Category.create(req.body)
        res.json(newCategory)
    }catch(error){
        throw new Error(error)
    }
})
const updateCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);

    try{
        const updateCategory=await Category.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateCategory)
    }catch(error){
        throw new Error(error)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory= await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    }
    catch(error){
        throw new Error(error)
    }
})

const getCategory=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    validateMongoDbId(id);

    try{
        const getCategory=await Category.findById(id)
        res.json(getCategory)
    }catch(error){
        throw new Error(error)
    }
})

const getAllCategory=asyncHandler(async(req,res)=>{
    try{
        const getAllCategory= await Category.find()
        res.json(getAllCategory);
    }
    catch(error){
        throw new Error(error)
    }
})
module.exports={createCategory,updateCategory,deleteCategory,getCategory,getAllCategory}