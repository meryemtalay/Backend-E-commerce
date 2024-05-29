const mongoose = require('mongoose'); 
// Kullanıcı parolalarını güvenli bir şekilde saklar.
const bcrypt= require('bcrypt')
const crypto=require("crypto")
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default:"user",
    },
    isBlocked: {
        type: Boolean,
        default:false
    },
    cart:{
        type: Array,
        default: [],
    },
    address:{
        type:String,
    },
    wishlist:[{type: mongoose.Schema.Types.ObjectId,ref: "Product",}],
    
    refreshToken: {
        type:String,
    },
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    },
    // Şemanın oluşturulma ve güncellenme zamanlarını otomatik ekler.
    {
        timestamps:true, 
    }

);

// Kullanıcı kaydedilmeden önce çalışır.
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password= await bcrypt.hash(this.password,salt)
})
// Eğer şifreler eşleşiyorsa (doğrulama)
userSchema.methods.isPasswordMatched= async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
// Kullanıcının parolasını sıfırlaması için token oluşturur
userSchema.methods.createPasswordResetToken= async function(){
    //rastgele bir token oluşturulur
    const resettoken=crypto.randomBytes(32).toString("hex")
    //sonra token hashlenir
    this.passwordResetToken=crypto.createHash('sha256').update(resettoken).digest("hex")
    this.passwordResetExpires=Date.now()+ 30 * 60 * 1000; // 30 minutes
    return resettoken;
}
//Export the model
module.exports = mongoose.model('User', userSchema);