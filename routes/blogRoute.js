const express=require("express");
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlogs, likeBlog, dislikeBlog,uploadImages } = require("../controller/blogCtrl");
const {blogImgResize,uploadPhoto}=require("../middlewares/uploadImages")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router=express.Router()

//route sıraları önemli!!
router.post("/",authMiddleware,isAdmin,createBlog)
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images",2),blogImgResize,uploadImages)
// router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images",2))
router.put('/likes',authMiddleware,likeBlog)
router.put('/dislikes',authMiddleware,dislikeBlog)
router.put("/:id",authMiddleware,isAdmin,updateBlog)
router.get("/:id",getBlog)
router.get("/:id",getBlog)
router.get("/",getAllBlog);
router.delete("/:id",authMiddleware,isAdmin,deleteBlogs);


module.exports=router