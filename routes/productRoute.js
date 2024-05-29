const express=require('express');
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require('../controller/productCtrl');
const {isAdmin,authMiddleware}=require('../middlewares/authMiddleware');
const { productImgResize,uploadPhoto } = require('../middlewares/uploadImages');
const router=express.Router();


router.post('/',authMiddleware,isAdmin,createProduct)
// router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array("images",10),productImgResize,uploadImages)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), (err, req, res, next) => {
    // if (err) {
    //     console.error(err);
    //     return res.status(400).send({ error: err.message });
    // }
    next();
}, uploadImages);

// router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), (err, req, res, next) => {
//     // if (err) {
//     //     console.error(err);
//     //     return res.status(400).send({ error: err.message });
//     // }
//     next();
// }, productImgResize, uploadImages);
router.get('/:id',getaProduct)
router.put('/wishlist',authMiddleware,addToWishlist)
router.put('/rating',authMiddleware,rating)
router.put('/:id',authMiddleware,isAdmin,updateProduct)
router.delete('/:id',authMiddleware,isAdmin,deleteProduct)
router.get('/',getAllProduct)

module.exports=router;