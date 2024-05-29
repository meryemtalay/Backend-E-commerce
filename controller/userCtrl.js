const { generateToken } = require("../config/jwtToken");
const User= require("../models/userModel");
const Product= require("../models/productModel");
const Cart= require("../models/cartModel");
require('dotenv').config();
const crypto=require('crypto')
const asyncHandler= require("express-async-handler");  
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const  jwt  = require("jsonwebtoken");

const sendEmail = require("./emailCtrl");
//Create a user
const createUser=asyncHandler( async(req,res)=> {
    const email=req.body.email;
    const findUser=await User.findOne({email: email});
    if(!findUser){
        //Create new User 
        const newUser= await User.create(req.body);
        res.json(newUser);
    }else {
       throw new Error("User Already Exists");
    }
})

// asyncHandler: Asenkron fonksiyonların hata yönetimini kolaylaştırır. 
// async/await yapısı kullanırken her await ifadesi için try/catch blokları yazmak zorunda kalmadan hataların yakalanmasını sağlar.

//Login a user
const loginUserCtrl= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    // check if exists
    const findUser=await User.findOne({email})   
    if(findUser && (await  findUser.isPasswordMatched(password))) {
        const refreshToken=await generateRefreshToken(findUser?._id);
        const updateuser=await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken:refreshToken,
            },
            {
                new:true
            });
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge: 72 * 60 *60 * 1000,
        })

        res.json({
            _id: findUser?._id,
            name:findUser?.name,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:generateToken(findUser?._id),
        })
    } else{
        throw new Error("Invalid Credenticals")
    }
})

//admin login
const loginAdmin= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    // check if exists
    const findAdmin=await User.findOne({email})   
    if(findAdmin.role!=='admin') throw new Error("Not Authorized")
    if(findAdmin && (await  findAdmin.isPasswordMatched(password))) {
        const refreshToken=await generateRefreshToken(findAdmin?._id);
        const updateuser=await User.findByIdAndUpdate(findAdmin.id,
            {
                refreshToken:refreshToken,
            },
            {
                new:true
            });
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge: 72 * 60 *60 * 1000,
        })

        res.json({
            _id: findAdmin?._id,
            name:findAdmin?.name,
            email:findAdmin?.email,
            mobile:findAdmin?.mobile,
            token:generateToken(findAdmin?._id),
        })
    } else{
        throw new Error("Invalid Credenticals")
    }
})




//Handle refresh token
const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken})
    if(!user) throw new Error("No refresh token present in db or not matched")
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id!==decoded.id){
            throw new Error("There is something wrong with refresh token")
        }    
        const accessToken=generateToken(user?._id)
        res.json({accessToken})
        })
    })


// logout functionality

const logout=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken})
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true,
        })
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    })
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: true,
    })
     res.sendStatus(204);
})

//Update a user
const updatedUser=asyncHandler(async(req,res)=>{
    // console.log(req.user)
    const { _id }=req.user;
    validateMongoDbId(_id);
    try{
        const updatedUser=await User.findByIdAndUpdate(
            _id,
            {
            name: req?.body?.name,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new:true,
        }
    );
    res.json(updatedUser);
    }
    catch(error){
        throw new Error(error)
    }
})

// save user Address
const saveAdress=asyncHandler(async(req,res,next)=>{
    const {_id}=req.user;
    validateMongoDbId(_id);

    try{
        const updatedUser=await User.findByIdAndUpdate(
            _id,
            {
            address: req?.body?.address,
            },
        {
            new:true,
        }
    );
    res.json(updatedUser);
    }
    catch(error){
        throw new Error(error)
    }
})

//Get all user
const getallUser=asyncHandler(async(req,res)=>{
    try{
        // User.find() asenkron bir işlem olduğu için await anahtar kelimesiyle beklenir.
        const getUsers= await User.find()
        res.json(getUsers);
    }
    catch(error){
        throw new Error(error)
    }
})

//Get a single user
const getaUser=asyncHandler(async(req,res)=>{
    //req.params=dinamik parametrelere erişmek için
    const { id }=req.params;
    validateMongoDbId(id);
    try{
        // User.find() asenkron bir işlem olduğu için await anahtar kelimesiyle beklenir.
        const getUser= await User.findById(id);
        res.json(getUser);
    }
    catch(error){
        throw new Error(error)
    }
})

//Delete a single user
const deleteaUser=asyncHandler(async(req,res)=>{
    //req.params=dinamik parametrelere erişmek için
    const { id }=req.params;
    validateMongoDbId(id);

    try{
        // User.find() asenkron bir işlem olduğu için await anahtar kelimesiyle beklenir.
        const deleteaUser= await User.findByIdAndDelete(id);
        res.json({deleteaUser});
    }
    catch(error){
        throw new Error(error)
    }
})

const blockUser=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    validateMongoDbId(id);

    try{
        const blockusr= await User.findByIdAndUpdate(id,{isBlocked:true,},{new:true,})
        res.json(blockusr)
    }catch(error){
        throw new Error(error)
    }
})

const unblockUser=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    validateMongoDbId(id);
    try{
        const unblock= await User.findByIdAndUpdate(id,{isBlocked:false,},{new:true,})
        res.json({
            message: "User unblocked"
        })
    }catch(error){
        throw new Error(error)
    }
})

const updatePassword=asyncHandler(async(req,res)=>{
    const {_id} =req.user;
    const {password}=req.body;
    //kimlik doğrulama
    validateMongoDbId(_id);
    const user= await User.findById(_id);
    if(password){
        user.password=password;
        const updatedPassword= await user.save();
        res.json(updatedPassword)
    }
    else {
        res.json(user)
    }
})

const forgotPasswordToken=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    const user= await User.findOne({email});
    if(!user) throw new Error("User not found with this email")
    try{
       const token= await  user.createPasswordResetToken()
       await user.save()
       const resetURL=`Hi, Please follow this link to reset Your Password. This link is valid till 30 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
       const data={
        to:email,
        text:"Hey User",
        subject:"Forgot Password Link",
        htm:resetURL 
       }
       sendEmail(data);
       res.json(token);
    }
    catch(error){
        throw new Error(error)
    }
})

const resetPassword=asyncHandler(async(req,res)=>{
    const {password}=req.body;
    const {token}=req.params;
    const hashedToken=crypto.createHash('sha256').update(token).digest("hex")
    const user=await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })
    if(!user) throw new Error("Token Expired, Please try again later")
    user.password=password;
    user.passwordResetToken=undefined;
    user.passwordResetToken=undefined;
    await user.save()
    res.json(user);

})

const getWishlist=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    try{
        const findUser=await User.findById(_id).populate("wishlist")
        res.json(findUser)
    }catch(error){
        throw new Error(error)
    }
})
// DİKKAT
    const userCart = asyncHandler(async (req, res) => {
        const { cart } = req.body;
        const {_id}=req.user;

        validateMongoDbId(_id);

        try {
          let products = [];
          const user = await User.findById(_id);
          // check if user already have product in cart
          const alreadyExistCart = await Cart.findOne({ orderby: user._id });
          if (alreadyExistCart) {
            alreadyExistCart.remove();
          }
          for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
          }
          console.log(products)
          let cartTotal = 0;
          for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
          }
          let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
          }).save();
          res.json(newCart);
        } catch (error) {
          throw new Error(error);
        }
      });

      const getUserCart=asyncHandler(async(req,res)=>{
        const {_id}=req.user;
        validateMongoDbId(_id);
        try{
            const cart=await Cart.findOne({orderby:_id})
            res.json(cart)
        }catch(error){
            throw new Error(error)
        }
      })

module.exports={createUser, loginUserCtrl, getallUser,getaUser,deleteaUser,updatedUser,blockUser,unblockUser, handleRefreshToken,logout ,updatePassword,forgotPasswordToken,resetPassword,loginAdmin,getWishlist,saveAdress,userCart,getUserCart}