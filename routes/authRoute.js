const express= require("express");
require('dotenv').config();

const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser, blockUser, unblockUser, handleRefreshToken,logout,updatePassword,forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAdress, userCart, getUserCart } = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
//router nesnesi oluşturdum
const router=express.Router();
router.post("/register",createUser);
router.post("/forgot-password-token",forgotPasswordToken)
router.put("/reset-password/:token",resetPassword)
router.put('/password',authMiddleware,updatePassword)

router.post("/login",loginUserCtrl);
router.post("/admin-login",loginAdmin)
router.post("/cart",authMiddleware,userCart)

router.get("/all-users",getallUser);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logout);
router.get("/wishlist",authMiddleware,getWishlist);
router.get("/cart",authMiddleware,getUserCart);

// authMiddlewarede kimlik doğrulaması yapıldıktan sonra kullanıcının admin olup olmadığını kontrol eder.
// Eğer adminse belirli bir kullanıcı idsine göre döner.
router.get("/:id",authMiddleware,isAdmin ,getaUser);
router.delete("/:id",deleteaUser);
router.put("/save-address",authMiddleware,saveAdress);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);


module.exports=router;