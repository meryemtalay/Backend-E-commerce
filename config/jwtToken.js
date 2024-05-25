const jwt= require("jsonwebtoken");
// id ile token üretme
const generateToken=(id) => {
    // jwt.sign(payload, secretOrPrivateKey, [options, callback]) fonksiyonu, bir payload (veri), gizli anahtar ve opsiyonel olarak ek ayarlar alarak bir JWT oluşturur.
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:"1d"}) //token süresi 1 gün olarak belirlenmiş
}

module.exports={generateToken}